import { Actor,HttpAgent } from "@dfinity/agent";
import { idlFactory as token_idl, canisterId as token_backend_id } from "../declarations/ICPad_backend";


const agent = new HttpAgent();
if(process.env.DFX_NETWORK === "local"){
    agent.fetchRootKey();
}
export const ICPad_backend = Actor.createActor(token_idl,{
    agent,
    canisterId: token_backend_id,
});