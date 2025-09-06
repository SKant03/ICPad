use candid::{CandidType, Deserialize};
use ic_cdk_macros::{query, update};
use std::cell::RefCell;
use std::collections::BTreeMap;

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

#[derive(CandidType, Deserialize, Clone)]
pub struct SearchFilters {
    pub category: Option<String>,
    pub language: Option<String>,
    pub min_rating: Option<f32>,
    pub author: Option<String>,
}

thread_local! {
    static TEMPLATES: RefCell<BTreeMap<String, Template>> = RefCell::new(BTreeMap::new());
}

#[update]
fn create_template(
    name: String,
    description: String,
    category: String,
    language: String,
    code: String,
    author: String,
) -> String {
    let template_id = format!("tpl_{}", ic_cdk::api::time());
    let now = ic_cdk::api::time();

    let template = Template {
        id: template_id.clone(),
        name,
        description,
        category,
        language,
        code,
        author,
        downloads: 0,
        rating: 0.0,
        created_at: now,
        updated_at: now,
    };

    TEMPLATES.with(|t| {
        t.borrow_mut().insert(template_id.clone(), template);
    });

    template_id
}

#[query]
fn list_templates() -> Vec<Template> {
    TEMPLATES.with(|t| t.borrow().values().cloned().collect())
}

#[query]
fn get_template(template_id: String) -> Option<Template> {
    TEMPLATES.with(|t| t.borrow().get(&template_id).cloned())
}

#[query]
fn search_templates(query: String, filters: Option<SearchFilters>) -> Vec<Template> {
    TEMPLATES.with(|t| {
        let templates = t.borrow();
        templates
            .values()
            .filter(|template| {
                // Text search
                let matches_query = query.is_empty() || 
                    template.name.to_lowercase().contains(&query.to_lowercase()) ||
                    template.description.to_lowercase().contains(&query.to_lowercase()) ||
                    template.code.to_lowercase().contains(&query.to_lowercase());
                
                // Apply filters if provided
                let matches_filters = if let Some(filters) = &filters {
                    let category_match = filters.category.as_ref().map_or(true, |cat| template.category == *cat);
                    let language_match = filters.language.as_ref().map_or(true, |lang| template.language == *lang);
                    let rating_match = filters.min_rating.map_or(true, |min| template.rating >= min);
                    let author_match = filters.author.as_ref().map_or(true, |auth| template.author == *auth);
                    
                    category_match && language_match && rating_match && author_match
                } else {
                    true
                };
                
                matches_query && matches_filters
            })
            .cloned()
            .collect()
    })
}

#[query]
fn get_categories() -> Vec<String> {
    let mut categories = std::collections::HashSet::new();
    TEMPLATES.with(|t| {
        for template in t.borrow().values() {
            categories.insert(template.category.clone());
        }
    });
    categories.into_iter().collect()
}

#[query]
fn get_languages() -> Vec<String> {
    let mut languages = std::collections::HashSet::new();
    TEMPLATES.with(|t| {
        for template in t.borrow().values() {
            languages.insert(template.language.clone());
        }
    });
    languages.into_iter().collect()
}

#[update]
fn rate_template(template_id: String, rating: f32) -> bool {
    if rating < 1.0 || rating > 5.0 {
        return false;
    }
    
    TEMPLATES.with(|t| {
        let mut map = t.borrow_mut();
        if let Some(template) = map.get_mut(&template_id) {
            // Simple average rating calculation
            if template.rating == 0.0 {
                template.rating = rating;
            } else {
                template.rating = (template.rating + rating) / 2.0;
            }
            template.updated_at = ic_cdk::api::time();
            return true;
        }
        false
    })
}

#[update]
fn download_template(template_id: String) -> bool {
    TEMPLATES.with(|t| {
        let mut map = t.borrow_mut();
        if let Some(template) = map.get_mut(&template_id) {
            template.downloads += 1;
            template.updated_at = ic_cdk::api::time();
            return true;
        }
        false
    })
}

#[update]
fn update_template(
    template_id: String,
    name: Option<String>,
    description: Option<String>,
    category: Option<String>,
    language: Option<String>,
    code: Option<String>,
) -> bool {
    TEMPLATES.with(|t| {
        let mut map = t.borrow_mut();
        if let Some(template) = map.get_mut(&template_id) {
            if let Some(name) = name {
                template.name = name;
            }
            if let Some(description) = description {
                template.description = description;
            }
            if let Some(category) = category {
                template.category = category;
            }
            if let Some(language) = language {
                template.language = language;
            }
            if let Some(code) = code {
                template.code = code;
            }
            template.updated_at = ic_cdk::api::time();
            return true;
        }
        false
    })
}

#[query]
fn get_template_stats() -> (u32, f32, u32) {
    TEMPLATES.with(|t| {
        let templates = t.borrow();
        let total_templates = templates.len() as u32;
        let total_downloads: u32 = templates.values().map(|t| t.downloads).sum();
        let avg_rating = if total_templates > 0 {
            templates.values().map(|t| t.rating).sum::<f32>() / total_templates as f32
        } else {
            0.0
        };
        (total_templates, avg_rating, total_downloads)
    })
}

// Initialize with some sample templates
#[update]
fn initialize_sample_templates() -> bool {
    let now = ic_cdk::api::time();
    
    let sample_templates = vec![
        Template {
            id: "tpl_hello_world".to_string(),
            name: "Hello World Canister".to_string(),
            description: "A simple hello world canister in Rust for Internet Computer".to_string(),
            category: "Smart Contract".to_string(),
            language: "Rust".to_string(),
            code: r#"use ic_cdk_macros::{query, update};

#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[update]
fn set_greeting(message: String) {
    // Store greeting message
    ic_cdk::storage::stable_save((message,));
}

#[query]
fn get_greeting() -> String {
    ic_cdk::storage::stable_restore::<(String,)>().0
}"#.to_string(),
            author: "ICPad Team".to_string(),
            downloads: 42,
            rating: 4.5,
            created_at: now,
            updated_at: now,
        },
        Template {
            id: "tpl_counter".to_string(),
            name: "Counter Canister".to_string(),
            description: "A simple counter canister with increment/decrement functionality".to_string(),
            category: "Smart Contract".to_string(),
            language: "Rust".to_string(),
            code: r#"use ic_cdk_macros::{query, update};
use std::cell::RefCell;

thread_local! {
    static COUNTER: RefCell<u32> = RefCell::new(0);
}

#[query]
fn get_count() -> u32 {
    COUNTER.with(|c| *c.borrow())
}

#[update]
fn increment() -> u32 {
    COUNTER.with(|c| {
        let current = *c.borrow();
        *c.borrow_mut() = current + 1;
        current + 1
    })
}

#[update]
fn decrement() -> u32 {
    COUNTER.with(|c| {
        let current = *c.borrow();
        if current > 0 {
            *c.borrow_mut() = current - 1;
        }
        *c.borrow()
    })
}

#[update]
fn reset() {
    COUNTER.with(|c| *c.borrow_mut() = 0);
}"#.to_string(),
            author: "ICPad Team".to_string(),
            downloads: 28,
            rating: 4.2,
            created_at: now,
            updated_at: now,
        },
        Template {
            id: "tpl_nft_basic".to_string(),
            name: "Basic NFT Canister".to_string(),
            description: "A basic NFT implementation with minting and transfer functionality".to_string(),
            category: "NFT".to_string(),
            language: "Rust".to_string(),
            code: r#"use ic_cdk_macros::{query, update};
use std::collections::BTreeMap;

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct Token {
    pub id: u32,
    pub owner: String,
    pub metadata: String,
}

thread_local! {
    static TOKENS: RefCell<BTreeMap<u32, Token>> = RefCell::new(BTreeMap::new());
    static NEXT_TOKEN_ID: RefCell<u32> = RefCell::new(1);
}

#[update]
fn mint_token(owner: String, metadata: String) -> u32 {
    let token_id = NEXT_TOKEN_ID.with(|id| {
        let current = *id.borrow();
        *id.borrow_mut() = current + 1;
        current
    });
    
    let token = Token {
        id: token_id,
        owner,
        metadata,
    };
    
    TOKENS.with(|t| {
        t.borrow_mut().insert(token_id, token);
    });
    
    token_id
}

#[query]
fn get_token(token_id: u32) -> Option<Token> {
    TOKENS.with(|t| t.borrow().get(&token_id).cloned())
}

#[query]
fn get_tokens_by_owner(owner: String) -> Vec<Token> {
    TOKENS.with(|t| {
        t.borrow()
            .values()
            .filter(|token| token.owner == owner)
            .cloned()
            .collect()
    })
}

#[update]
fn transfer_token(token_id: u32, new_owner: String) -> bool {
    TOKENS.with(|t| {
        let mut tokens = t.borrow_mut();
        if let Some(token) = tokens.get_mut(&token_id) {
            token.owner = new_owner;
            true
        } else {
            false
        }
    })
}"#.to_string(),
            author: "ICPad Team".to_string(),
            downloads: 15,
            rating: 4.8,
            created_at: now,
            updated_at: now,
        },
    ];
    
    TEMPLATES.with(|t| {
        let mut map = t.borrow_mut();
        for template in sample_templates {
            map.insert(template.id.clone(), template);
        }
    });
    
    true
}

ic_cdk::export_candid!();
