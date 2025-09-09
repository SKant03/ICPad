use candid::CandidType;
use ic_cdk::query;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Deserialize, Serialize)]
pub struct HttpRequest {
    pub method: String,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: Vec<u8>,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct HttpResponse {
    pub status_code: u16,
    pub headers: Vec<(String, String)>,
    pub body: Vec<u8>,
    pub upgrade: Option<bool>,
    pub streaming_strategy: Option<String>,
}

#[query]
pub fn http_request(req: HttpRequest) -> HttpResponse {
    let path = req.url.split('?').next().unwrap_or("/");
    
    // Serve index.html for all routes to enable client-side routing
    let html_content = include_str!("../../ICPad_frontend/dist/index.html");
    
    HttpResponse {
        status_code: 200,
        headers: vec![
            ("Content-Type".to_string(), "text/html".to_string()),
            ("Cache-Control".to_string(), "no-cache".to_string()),
        ],
        body: html_content.as_bytes().to_vec(),
        upgrade: None,
        streaming_strategy: None,
    }
}

ic_cdk::export_candid!();
