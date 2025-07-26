use candid::{CandidType, Deserialize};
use std::collections::HashMap;

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

// In-memory storage for projects
static mut PROJECTS: Option<HashMap<String, Project>> = None;

fn get_projects() -> &'static mut HashMap<String, Project> {
    unsafe {
        if PROJECTS.is_none() {
            PROJECTS = Some(HashMap::new());
        }
        PROJECTS.as_mut().unwrap()
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
