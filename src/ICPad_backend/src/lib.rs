use candid::CandidType;
use ic_cdk_macros::update;
use ic_cdk::management_canister::http_request;
use ic_management_canister_types::{HttpRequestArgs, HttpHeader, HttpMethod, HttpRequestResult};
use serde::Deserialize;
use num_traits::ToPrimitive;

#[derive(CandidType, Deserialize)]
struct SessionResponse {
    session_id: String,
}

#[update]
async fn start_docker_session(user_id: String) -> Result<String, String> {
    // Prepare JSON body with user_id
    let payload = format!(r#"{{"user_id":"{}"}}"#, user_id);

    let req = HttpRequestArgs {
        url: "http://localhost:3030".to_string(),
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
            // Convert candid::Nat to u64 for comparison
             if status.0.to_u64().unwrap_or(0) != 200 {
                return Err(format!("Non-200 status code: {}", status));
            }

            // Parse response body as JSON
            let body_str = String::from_utf8_lossy(&body);
            let session: SessionResponse =
                serde_json::from_str(&body_str).map_err(|e| format!("JSON parse error: {}", e))?;

            Ok(session.session_id)
        }
        Err(err) => Err(format!("HTTP call failed: {:?}", err)),
    }
}
