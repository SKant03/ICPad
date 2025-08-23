import { Actor,HttpAgent } from "@dfinity/agent";
import { idlFactory as token_idl, canisterId as ICPad_marketplace_id } from "../src/declarations/ICPad_marketplace";


const agent = new HttpAgent();
if(process.env.DFX_NETWORK === "local"){
    agent.fetchRootKey();
}
export const ICPad_marketplace = Actor.createActor(token_idl,{
    agent,
    canisterId: ICPad_marketplace_id,
});