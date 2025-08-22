use candid::CandidType;
use ic_cdk_macros::update;
use ic_cdk::management_canister::http_request;
use ic_management_canister_types::{HttpRequestArgs, HttpHeader, HttpMethod, HttpRequestResult};
use serde::Deserialize;
use num_traits::ToPrimitive;
use std::time::Duration;
use ic_cdk_timers::set_timer;

#[derive(CandidType, Deserialize)]
struct SessionResponse {
    container_id: String,
    editor_url: String,
}

#[update]
async fn start_docker_session(user_id: String) -> Result<String, String> {
    let payload = format!(
        r#"{{"project_id":"test_project","user_id":"{}"}}"#,
        user_id
    );

    let req = HttpRequestArgs {
        url: "https://e2bd84efdf04.ngrok-free.app/start".to_string(),
        max_response_bytes: Some(2000),
        method: HttpMethod::POST,
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }],
        body: Some(payload.into_bytes()),
        transform: None,
    };

    match http_request(&req).await {
        Ok(HttpRequestResult { status, body, .. }) => {
            if status.0.to_u64().unwrap_or(0) != 200 {
                return Err(format!("Non-200 status code: {}", status));
            }

            let body_str = String::from_utf8_lossy(&body);
            let session: SessionResponse =
                serde_json::from_str(&body_str).map_err(|e| format!("JSON parse error: {}", e))?;

            let container_id = session.container_id.clone();

            // Schedule auto-stop after 5 minutes
            set_timer(Duration::from_secs(5 * 60), move || {
                ic_cdk::spawn(async move {
                    let _ = stop_docker_session(container_id.clone()).await;
                });
            });

            Ok(session.editor_url)
        }
        Err(err) => Err(format!("HTTP call failed: {:?}", err)),
    }
}

#[update]
async fn stop_docker_session(container_id: String) -> Result<String, String> {
    let payload = format!(r#"{{"container_id":"{}"}}"#, container_id);

    let req = HttpRequestArgs {
        url: "https://e2bd84efdf04.ngrok-free.app/stop".to_string(),
        max_response_bytes: Some(2000),
        method: HttpMethod::POST,
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }],
        body: Some(payload.into_bytes()),
        transform: None,
    };

    match http_request(&req).await {
        Ok(HttpRequestResult { status, body, .. }) => {
            if status.0.to_u64().unwrap_or(0) != 200 {
                return Err(format!("Non-200 status code: {}", status));
            }
            Ok("Container stopped successfully".to_string())
        }
        Err(err) => Err(format!("HTTP call failed: {:?}", err)),
    }
}

ic_cdk::export_candid!();
