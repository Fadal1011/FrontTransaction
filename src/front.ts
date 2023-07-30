const listeClientUrl:string = "http://127.0.0.1:8000/api/client";
const depot ='http://127.0.0.1:8000/api/transactions';
const historique ='http://127.0.0.1:8000/api/historique'



let Fournisseur: HTMLInputElement | null = document.getElementById('Fournisseur') as HTMLInputElement;
let Transaction:HTMLInputElement| null = document.getElementById('Transaction') as HTMLInputElement;

let telExpediteur: HTMLInputElement | null = document.getElementById('telExpediteur') as HTMLInputElement;
let nomCompletExpediteur: HTMLInputElement |null = document.getElementById('nomCompletExpediteur') as HTMLInputElement;
let teldestinataire:HTMLInputElement | null = document.getElementById('teldestinataire') as HTMLInputElement;
let nomCompletdestinataire:HTMLInputElement | null = document.getElementById('nomCompletdestinataire') as HTMLInputElement;
let Montant:HTMLInputElement | null = document.getElementById('Montant') as HTMLInputElement;
let valider:HTMLElement | null = document.getElementById('valider');
let ilChangeParRetrait:HTMLElement | null = document.querySelector('.ilChangeParRetrait');
let couleurEnfonctiondufourn:HTMLElement | null = document.querySelector('.couleurEnfonctiondufourn');

let listransaction:HTMLElement | null = document.querySelector('.listransaction');
let detail:HTMLElement | null = document.querySelector('.detail');
let historiqueElement:HTMLElement | null = document.querySelector('.historique');
let formElement:HTMLElement | null = document.querySelector('.form')
let pardestinataire:HTMLElement | null = document.querySelector('.destinataire');

nomCompletdestinataire.disabled = true;
nomCompletExpediteur.disabled=true;

let fournisseur:string[] =['Orange money','Wave','Wari','CB'];
let transaction:string[]=['depot','retrait','transfer'];

  
chargerNomComplet(listeClientUrl,telExpediteur,nomCompletExpediteur);
chargerNomComplet(listeClientUrl,teldestinataire,nomCompletdestinataire);

chargerSelect(Fournisseur,fournisseur)
chargerSelect(Transaction,transaction)


detail.addEventListener('click',()=>{
    historiqueElement.classList.toggle('active');
    formElement.classList.toggle('active');
});


telExpediteur.addEventListener('input',()=>{
    listransaction.innerHTML=""
    fetch(historique+`/numero/${telExpediteur.value}/operateur/${Fournisseur.value}`,{
        method: "Get",
    }).then(response=>response.json())
    .then(data =>{
        let transaction =data.transaction;
        transaction.forEach((e)=>{
            const{typeTransfer,montant,created_at}=e
        listransaction.innerHTML +=`
        <div class="transaction">
            <div class="typeTransfer">${typeTransfer}</div>
            <div class="flex">
            <div class="date">
                ${created_at}
            </div>
            <div class="montant">${montant} fcfa</div>
            </div>
        </div>
        `  
        })
    })
})



Transaction.addEventListener('change',()=>{
    pardestinataire.style.display = "flex";
    // nomCompletdestinataire.value=""; 
    // teldestinataire.value =""
    // teldestinataire.disabled=false;
    // nomCompletdestinataire.style.background ="white";
    // nomCompletdestinataire.style.background ="white";
    if(Transaction.value === "retrait"){
        // teldestinataire.disabled=true;
        // nomCompletdestinataire.style.background ="red";
        // teldestinataire.style.background="red"
        pardestinataire.style.display = "none";
    }
})

valider.addEventListener("click",()=>{
    let destinataire = teldestinataire.value;
    if(Transaction.value==="retrait"){
        destinataire= telExpediteur.value;
    }
    let requestData ={
        Expediteur:telExpediteur.value,
        montant:Montant.value,
        typeTransfer:Transaction.value,
        operateur:Fournisseur.value,
        destinataire:destinataire,
    }

fetch(depot,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify(requestData)
    })
    .then((response) => {
        if(response.ok){
            alert('La transaction a été effectuée avec succès !')
        }
        if(!response.ok){
            alert('Erreur lors du transaction!')
        }
        return response.json();
    })
    .then((data) => {
      console.log(data);
    });
})


// Transaction.addEventListener('change',()=>{
//     telExpediteur.value="";
//     nomCompletExpediteur.value=""; 
//     ilChangeParRetrait.textContent="Destinataire";
//     telExpediteur.disabled=false;
//     // nomCompletExpediteur.disabled=false;
//     if(Transaction.value === "retrait"){
//         telExpediteur.disabled=true;
//         ilChangeParRetrait.textContent="numero de retrait";
//     }
// })

Fournisseur.addEventListener('change',()=>{
    couleurEnfonctiondufourn.style.color ="black";
    if(Fournisseur.value=="Wave"){
        couleurEnfonctiondufourn.style.color ="blue";
    }
    if(Fournisseur.value=="Orange money"){
        couleurEnfonctiondufourn.style.color ="orange";
    }
    if(Fournisseur.value=="Wari"){
        couleurEnfonctiondufourn.style.color ="green";
    }

    if(Fournisseur.value=="CB"){
        couleurEnfonctiondufourn.style.color ="crimson";
    }
})



















function chargerSelect(element: HTMLElement | null, tab: string[]) {
    if (!element) {
      console.error("Élément HTML introuvable.");
      return;
    }
    if(!fournisseur){

    }
  
    tab.forEach((e) => {
      let option = document.createElement('option');
      option.textContent = e;
      option.value = e
      element.appendChild(option);
    });
}
function chargerNomComplet(apiFetch:string,telElement:HTMLInputElement,telNom:HTMLInputElement){
    fetch(apiFetch)
    .then((response) => response.json())
    .then((data)=>{
    
    telElement.addEventListener('input',()=>{
        detail.style.display ="none";
        telNom.value=""
        let telValue = telElement.value;
        data.forEach((item)=>{
            const{prenom,nom,numero}=item
            if(telValue===numero){
                telNom.value = prenom + " " + nom;
            }
                
            if(nomCompletExpediteur.value!==""){
                detail.style.display ="block";
            }
        })
    })
});
}