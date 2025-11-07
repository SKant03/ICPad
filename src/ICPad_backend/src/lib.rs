use candid::{CandidType, Deserialize};
use ic_cdk::management_canister::{
    http_request, HttpHeader, HttpMethod, HttpRequestArgs, HttpResponse, TransformArgs,
    TransformContext,
};
use ic_cdk_macros::*;
use serde::Serialize;

const CONTROLLER_URL: &str = "https://<YOUR_NGROK_URL>.ngrok-free.app"; // replace with ngrok link

#[derive(Debug, Serialize, Deserialize, CandidType)]
struct FileRequest {
    filename: String,
    content: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, CandidType)]
struct FileResponse {
    message: String,
}

// A transform function to strip headers (required for IC outcalls)
#[query]
fn transform(resp: TransformArgs) -> HttpResponse {
    HttpResponse {
        status: resp.response.status,
        body: resp.response.body,
        headers: vec![], // strip headers for determinism
    }
}

async fn call_server(endpoint: &str, payload: &FileRequest) -> Result<String, String> {
    let url = format!("{}/{}", CONTROLLER_URL, endpoint);

    let body = serde_json::to_vec(payload).map_err(|e| e.to_string())?;

    let request = HttpRequestArgs {
        url,
        method: HttpMethod::POST,
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }],
        body: Some(body),
        max_response_bytes: Some(2_000_000),
        transform: Some(TransformContext::new(transform, vec![])), // references transform query
    };

    let cycles = 2_000_000_000; // attach cycles for outcall
    match http_request(request, cycles).await {
        Ok((response,)) => {
            let body = String::from_utf8(response.body).unwrap_or_default();
            let parsed: Result<FileResponse, _> = serde_json::from_str(&body);
            match parsed {
                Ok(res) => Ok(res.message),
                Err(_) => Ok(body), // fallback: return raw body
            }
        }
        Err((code, msg)) => Err(format!("HTTP error {:?}: {}", code, msg)),
    }
}

#[update]
async fn createFile(filename: String) -> Result<String, String> {
    call_server("start", &FileRequest { filename, content: None }).await
}

#[update]
async fn saveFile(filename: String, content: String) -> Result<String, String> {
    call_server(
        "write",
        &FileRequest {
            filename,
            content: Some(content),
        },
    )
    .await
}

#[update]
async fn deleteFile(filename: String) -> Result<String, String> {
    call_server("stop", &FileRequest { filename, content: None }).await
}

#[update]
async fn readFile(filename: String) -> Result<String, String> {
    call_server("read", &FileRequest { filename, content: None }).await
}

#[update]
async fn renameFile(old_name: String, new_name: String) -> Result<String, String> {
    let content = readFile(old_name.clone()).await?;
    createFile(new_name.clone()).await?;
    saveFile(new_name.clone(), content.clone()).await?;
    deleteFile(old_name.clone()).await?;
    Ok(format!("Renamed '{}' → '{}'", old_name, new_name))
}

ic_cdk::export_candid!();
