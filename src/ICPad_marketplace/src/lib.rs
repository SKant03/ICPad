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

#[update]
fn rate_template(template_id: String, rating: f32) -> bool {
    TEMPLATES.with(|t| {
        let mut map = t.borrow_mut();
        if let Some(template) = map.get_mut(&template_id) {
            template.rating = (template.rating + rating) / 2.0;
            template.updated_at = ic_cdk::api::time();
            return true;
        }
        false
    })
}

ic_cdk::export_candid!();
