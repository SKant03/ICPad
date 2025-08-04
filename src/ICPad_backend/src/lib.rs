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

#[derive(CandidType, Deserialize)]
pub struct CompileResult {
    pub success: bool,
    pub output: String,
    pub errors: Vec<String>,
}

#[derive(CandidType, Deserialize)]
pub struct DeployResult {
    pub success: bool,
    pub canister_id: Option<String>,
    pub url: Option<String>,
    pub output: String,
}

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
    };
    
    get_projects().insert(project_id.clone(), project);
    project_id
}

#[ic_cdk::query]
fn get_project(project_id: String) -> Option<Project> {
    get_projects().get(&project_id).cloned()
}

#[ic_cdk::query]
fn list_projects() -> Vec<Project> {
    get_projects().values().cloned().collect()
}

#[ic_cdk::update]
fn update_project_code(project_id: String, code: String) -> bool {
    if let Some(project) = get_projects().get_mut(&project_id) {
        project.code = code;
        project.updated_at = ic_cdk::api::time();
        project.status = "modified".to_string();
        true
    } else {
        false
    }
}

#[ic_cdk::update]
fn compile_project(project_id: String) -> CompileResult {
    if let Some(project) = get_projects().get(&project_id) {
        // Simulate compilation based on language
        match project.language.as_str() {
            "motoko" => {
                // Basic Motoko syntax validation
                if project.code.contains("actor") && project.code.contains("func") {
                    CompileResult {
                        success: true,
                        output: "Compilation successful! No errors found.".to_string(),
                        errors: vec![],
                    }
                } else {
                    CompileResult {
                        success: false,
                        output: "Compilation failed!".to_string(),
                        errors: vec!["Missing 'actor' declaration".to_string(), "Missing function declarations".to_string()],
                    }
                }
            }
            "rust" => {
                // Basic Rust syntax validation
                if project.code.contains("fn") && project.code.contains("ic_cdk") {
                    CompileResult {
                        success: true,
                        output: "Compilation successful! No errors found.".to_string(),
                        errors: vec![],
                    }
                } else {
                    CompileResult {
                        success: false,
                        output: "Compilation failed!".to_string(),
                        errors: vec!["Missing function declarations".to_string(), "Missing ic_cdk imports".to_string()],
                    }
                }
            }
            _ => CompileResult {
                success: false,
                output: "Unsupported language".to_string(),
                errors: vec!["Language not supported".to_string()],
            }
        }
    } else {
        CompileResult {
            success: false,
            output: "Project not found".to_string(),
            errors: vec!["Project not found".to_string()],
        }
    }
}

#[ic_cdk::update]
fn deploy_project(project_id: String) -> DeployResult {
    if let Some(project) = get_projects().get_mut(&project_id) {
        // Simulate deployment
        let canister_id = format!("{}-{}", project.language, ic_cdk::api::time());
        let url = format!("https://{}.ic0.app", canister_id);
        
        project.canister_id = Some(canister_id.clone());
        project.status = "deployed".to_string();
        project.updated_at = ic_cdk::api::time();
        
        DeployResult {
            success: true,
            canister_id: Some(canister_id),
            url: Some(url),
            output: format!("Successfully deployed {} to the Internet Computer!", project.name),
        }
    } else {
        DeployResult {
            success: false,
            canister_id: None,
            url: None,
            output: "Project not found".to_string(),
        }
    }
}

#[ic_cdk::update]
fn test_project(project_id: String, test_input: String) -> String {
    if let Some(project) = get_projects().get(&project_id) {
        // Simulate testing based on language
        match project.language.as_str() {
            "motoko" => {
                if project.code.contains("greet") {
                    format!("Test result: Hello, {}!", test_input)
                } else {
                    "Test failed: No greet function found".to_string()
                }
            }
            "rust" => {
                if project.code.contains("greet") {
                    format!("Test result: Hello, {}!", test_input)
                } else {
                    "Test failed: No greet function found".to_string()
                }
            }
            _ => "Test failed: Unsupported language".to_string()
        }
    } else {
        "Test failed: Project not found".to_string()
    }
}

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
    };
    
    get_templates().insert(template_id.clone(), template);
    template_id
}

#[ic_cdk::update]
fn install_template(template_id: String) -> String {
    if let Some(template) = get_templates().get(&template_id) {
        // Create a new project from the template
        let project_id = format!("proj_{}", ic_cdk::api::time());
        let now = ic_cdk::api::time();
        
        let project = Project {
            id: project_id.clone(),
            name: format!("{} (from template)", template.name),
            language: template.language.clone(),
            code: template.code.clone(),
            status: "created".to_string(),
            canister_id: None,
            created_at: now,
            updated_at: now,
        };
        
        get_projects().insert(project_id.clone(), project);
        
        // Increment download count
        if let Some(template_mut) = get_templates().get_mut(&template_id) {
            template_mut.downloads += 1;
            template_mut.updated_at = now;
        }
        
        project_id
    } else {
        "Template not found".to_string()
    }
}

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
