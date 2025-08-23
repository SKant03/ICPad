<<<<<<< HEAD

use candid::CandidType;
use ic_cdk_macros::update;
use ic_cdk::management_canister::http_request;
use ic_management_canister_types::{HttpRequestArgs, HttpHeader, HttpMethod, HttpRequestResult};
use serde::Deserialize;

use num_traits::ToPrimitive;
use std::time::Duration;
use ic_cdk_timers::set_timer;
use candid::{CandidType, Deserialize};
use std::collections::HashMap;
use std::collections::BTreeMap;

#[derive(CandidType, Deserialize, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub language: String,
    pub code: String,
    pub status: String,
    pub canister_id: Option<String>,
    pub created_at: u64,
    pub updated_at: u64,
}
=======
use candid::CandidType;
use ic_cdk::update;
use ic_cdk::management_canister::http_request;
use ic_management_canister_types::{HttpRequestArgs, HttpHeader, HttpMethod, HttpRequestResult};
use serde::Deserialize;
use num_traits::ToPrimitive;
use std::time::Duration;
use ic_cdk_timers::set_timer;
>>>>>>> ab3e637 (added user canister marketplace canister and a bit of ui changes)

#[derive(CandidType, Deserialize)]
struct SessionResponse {
    container_id: String,
    editor_url: String,
}

<<<<<<< HEAD

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

=======
#[update]
async fn start_docker_session(user_id: String) -> Result<String, String> {
    let payload = format!(
        r#"{{"project_id":"test_project","user_id":"{}"}}"#,
        user_id
    );

>>>>>>> ab3e637 (added user canister marketplace canister and a bit of ui changes)
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
<<<<<<< HEAD

#[derive(CandidType, Deserialize, Clone)]
pub struct Template {
    pub id: String,
    pub name: String,
    pub description: String,
    pub category: String,
    pub language: String,
    pub code: String,
    pub author: String,
    pub downloads: u32,
    pub rating: f32,
    pub created_at: u64,
    pub updated_at: u64,
}

// In-memory storage for projects
static mut PROJECTS: Option<HashMap<String, Project>> = None;

// In-memory storage for templates
static mut TEMPLATES: Option<BTreeMap<String, Template>> = None;

fn get_projects() -> &'static mut HashMap<String, Project> {
    unsafe {
        if PROJECTS.is_none() {
            PROJECTS = Some(HashMap::new());
        }
        PROJECTS.as_mut().unwrap()
    }
}

fn get_templates() -> &'static mut BTreeMap<String, Template> {
    unsafe {
        if TEMPLATES.is_none() {
            TEMPLATES = Some(BTreeMap::new());
            // Initialize with some default templates
            let mut templates = TEMPLATES.as_mut().unwrap();
            
            let motoko_token = Template {
                id: "motoko_token".to_string(),
                name: "ERC-20 Token Standard".to_string(),
                description: "A standard for fungible tokens, compatible with most EVM chains.".to_string(),
                category: "Token".to_string(),
                language: "motoko".to_string(),
                code: r#"actor {
  stable var totalSupply: Nat = 0;
  stable var name: Text = "";
  stable var symbol: Text = "";
  stable var decimals: Nat8 = 8;
  stable var balances: [(Principal, Nat)] = [];
  stable var allowances: [(Principal, [(Principal, Nat)])] = [];

  public query func name() : async Text { name };
  public query func symbol() : async Text { symbol };
  public query func decimals() : async Nat8 { decimals };
  public query func totalSupply() : async Nat { totalSupply };

  public query func balanceOf(owner: Principal) : async Nat {
    let balance = balances.iter().find(|(p, _)| p == &owner);
    match balance {
      Some((_, amount)) => *amount,
      None => 0
    }
  };

  public shared({caller}) func transfer(to: Principal, value: Nat) : async Bool {
    // Transfer logic here
    true
  };
}"#.to_string(),
                author: "DFINITY".to_string(),
                downloads: 1200,
                rating: 4.8,
                created_at: ic_cdk::api::time(),
                updated_at: ic_cdk::api::time(),
            };
            
            let rust_nft = Template {
                id: "rust_nft".to_string(),
                name: "NFT Minting Factory".to_string(),
                description: "Create and manage NFTs with customizable metadata and royalty features.".to_string(),
                category: "NFT".to_string(),
                language: "rust".to_string(),
                code: r#"use candid::{CandidType, Deserialize};
use ic_cdk::api;

#[derive(CandidType, Deserialize, Clone)]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub image_url: String,
    pub attributes: Vec<(String, String)>,
}

#[derive(CandidType, Deserialize)]
pub struct MintArgs {
    pub metadata: NFTMetadata,
    pub owner: String,
}

#[ic_cdk::update]
pub fn mint_nft(args: MintArgs) -> String {
    // Minting logic here
    format!("NFT minted for {}", args.owner)
}

#[ic_cdk::query]
pub fn get_nft_metadata(token_id: String) -> Option<NFTMetadata> {
    // Return NFT metadata
    None
}"#.to_string(),
                author: "Community Dev".to_string(),
                downloads: 850,
                rating: 4.5,
                created_at: ic_cdk::api::time(),
                updated_at: ic_cdk::api::time(),
            };
            
            templates.insert(motoko_token.id.clone(), motoko_token);
            templates.insert(rust_nft.id.clone(), rust_nft);
        }
        TEMPLATES.as_mut().unwrap()
    }
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]
fn create_project(name: String, language: String, initial_code: String) -> String {
    let project_id = format!("proj_{}", ic_cdk::api::time());
    let now = ic_cdk::api::time();
    
    let project = Project {
        id: project_id.clone(),
        name,
        language,
        code: initial_code,
        status: "created".to_string(),
        canister_id: None,
        created_at: now,
        updated_at: now,
=======
>>>>>>> ab3e637 (added user canister marketplace canister and a bit of ui changes)
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
<<<<<<< HEAD

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

// Marketplace functions
#[ic_cdk::query]
fn list_templates() -> Vec<Template> {
    get_templates().values().cloned().collect()
}

#[ic_cdk::query]
fn get_template(template_id: String) -> Option<Template> {
    get_templates().get(&template_id).cloned()
}

#[ic_cdk::update]
fn create_template(name: String, description: String, category: String, language: String, code: String) -> String {
    let template_id = format!("template_{}", ic_cdk::api::time());
    let now = ic_cdk::api::time();
    
    let template = Template {
        id: template_id.clone(),
        name,
        description,
        category,
        language,
        code,
        author: "ICPad User".to_string(),
        downloads: 0,
        rating: 0.0,
        created_at: now,
        updated_at: now,
=======

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
>>>>>>> ab3e637 (added user canister marketplace canister and a bit of ui changes)
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

<<<<<<< HEAD
#[ic_cdk::update]
fn rate_template(template_id: String, rating: f32) -> bool {
    if let Some(template) = get_templates().get_mut(&template_id) {
        // Simple average rating calculation
        let current_rating = template.rating;
        let current_downloads = template.downloads as f32;
        let new_rating = if current_downloads > 0.0 {
            (current_rating * current_downloads + rating) / (current_downloads + 1.0)
        } else {
            rating
        };
        
        template.rating = new_rating;
        template.updated_at = ic_cdk::api::time();
        true
    } else {
        false
    }
}

#[ic_cdk::update]
fn download_template(template_id: String) -> bool {
    if let Some(template) = get_templates().get_mut(&template_id) {
        template.downloads += 1;
        template.updated_at = ic_cdk::api::time();
        true
    } else {
        false
    }
}

=======
ic_cdk::export_candid!();
>>>>>>> ab3e637 (added user canister marketplace canister and a bit of ui changes)
