use candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::{query, update};
use std::cell::RefCell;
use std::collections::BTreeMap;

/// User struct stored in the canister
#[derive(CandidType, Deserialize, Clone)]
pub struct User {
    pub id: Principal,
    pub username: String,
    pub bio: Option<String>,
    pub joined_at: u64,
}

thread_local! {
    static USERS: RefCell<BTreeMap<Principal, User>> = RefCell::new(BTreeMap::new());
}

/// Register a new user
#[update]
fn register_user(id: Principal, username: String, bio: Option<String>) -> bool {
    let now = ic_cdk::api::time();
    let user = User {
        id,
        username,
        bio,
        joined_at: now,
    };
    USERS.with(|u| {
        u.borrow_mut().insert(id, user);
    });
    true
}

/// Fetch a user by principal
#[query]
fn get_user(id: Principal) -> Option<User> {
    USERS.with(|u| u.borrow().get(&id).cloned())
}

/// List all users
#[query]
fn list_users() -> Vec<User> {
    USERS.with(|u| u.borrow().values().cloned().collect())
}

// Export candid interface
ic_cdk::export_candid!();
