import {loadState} from "souls/state.js";
export async function openSaveSession(){
 const host=parent.IdleSoulsHost.open(window),state=loadState({getItem:()=>JSON.stringify(host.getProgress())});
 Object.defineProperty(state,'coins',{enumerable:true,configurable:true,get:()=>host.getGold(),set:value=>host.setGold(value)});
 const status=()=>({status:host.allowed()?'saved':'readonly',message:host.allowed()?'Progreso del personaje guardado.':'Sesión pausada.'});
 const session={state,get canMutate(){return host.allowed();},get status(){return status();},subscribe(){return()=>{};},save(){if(host.allowed())host.commit(state);return status();},close(){return this.save();}};return session;
}