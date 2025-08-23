import { Actor,HttpAgent } from "@dfinity/agent";
import { idlFactory as token_idl, canisterId as ICPad_user_id } from "../src/declarations/ICPad_user";


const agent = new HttpAgent();
if(process.env.DFX_NETWORK === "local"){
    agent.fetchRootKey();
}
export const ICPad_user = Actor.createActor(token_idl,{
    agent,
    canisterId: ICPad_user_id,
});