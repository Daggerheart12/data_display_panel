//Define constants.    
const card_container = document.getElementById("card_container");

//Set an interval to check the data file for new data.
window.setInterval(updateCardContent, 5000);

//Do stuff at the start.
window.onload = function() {   
    updateCardContent();

    //Start the input handling.
    window.addEventListener("keydown", handleInput);   
}

//Define a list of possible inputs. Handle each input individually.
function handleInput(e) {
    switch(e.key) {
        case "ArrowLeft":
            previousCard();
            break;
        case "ArrowRight":
            nextCard();
            break;
        case "r":
            updateCardContent()            

        default:
            //console.log(e.key);
            break;
    }
}

//Select the previous card in the list. Update the list of cards.
function previousCard() {
    const card = document.activeElement;

    if (card.previousElementSibling != null) {
        updateCardFocus(card.previousElementSibling.id);
    }
}

//Select the next card in the list. Update the list of cards.
function nextCard() {
    const card = document.activeElement;

    if (card.nextElementSibling != null) {
        updateCardFocus(card.nextElementSibling.id);
    }
}

//With a new card selected, flip the card, and update the rest to unflip the last one.
async function updateCardFocus(next_card_id) {   
    if (document.getElementById(next_card_id) != null)
    {
        var card = document.getElementById(next_card_id);
        replaceCardData(next_card_id, ["This card is focused", "The text has been replaced", "Dogs are the best"])
        card.tabIndex = 0;
        card.focus();
    }
    else {
        console.error("The card with the ID ${next_card_id} does not exist.")
    }
    
    //Refresh card data.
    await updateCardContent();
}

//Loop through all of the cards in the list, reset them all, and then flip the card that was selected. 
//This function will not overwrite data on focused cards.
async function updateCardContent(selected_card) {

     //Get cards.
    var cards = card_container.getElementsByClassName('info_card');

    //Get data from the file.
    const data_path = "http://localhost:8080/data/data.json";
    data = await getData(data_path);
    

    //Go through the data, and replace update all the cards in the list.
    //This includes adding new cards, and removing redundant ones.
    for (var i = 0; i < data.length; i++) {
        if (cards[i] != null) {
            if (cards[i] != document.activeElement) {
                replaceCardData(i, data[i]);
            }
        }
        else {
            createNewCard(i);
            replaceCardData(i, data[i]);
        }
    }    

    //Cull old cards.
    if (data.length < cards.length) {
        console.log("Number of cards to have " + data.length);
        console.log("Number of cards present "+ cards.length);
        console.log("Number to delete " + (cards.length - data.length));
        //There are more cards than data sections for cards.
        //Count down from the number of card we have, to the number of cards we should have.

        for (var i = data.length; i < cards.length; i++) {
            document.getElementById(i).remove();
        }
    }
}

//Read from the data file.
async function getData(path) {
    //File path to data. This assumes that the server is hosting on port 8080, that could be a problem later.
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("${response.status}");
        }

        return (await response.json());        
    }
    //Catch should only be called when an error is caught, and isn't called. It needs a variable to represent the error.
    catch (error) {
        console.error(error.message);
    }
}

//Search for, and replace existing card data using a card ID and provided device data.
function replaceCardData(card_id, data) {
    //Get the card object from the document.
    var card = document.getElementById(card_id);
    
    card.querySelector('p[id=name]').innerHTML = data[0];
    card.querySelector('p[id=cpu_load]').innerHTML = data[1];
    card.querySelector('p[id=cpu_temp]').innerHTML = data[2];
    card.tabIndex = -1;
}

//Create a new card and populate it with the required elements.
function createNewCard(card_id) {
    //Create a new card element.
    var new_info_card = document.createElement("div");

    //Assign content to the new card.
    new_info_card.className = "info_card";
    new_info_card.id = card_id;
    new_info_card.innerHTML = getInfoCardHtml();
    
    //Ensure that the starting card is focusable.
    if (card_id == 0) {
        new_info_card.tabIndex = '0';        
    }
    else {
        new_info_card.tabIndex = '-1';
    }

    //Append the card to the container.
    card_container.appendChild(new_info_card);
}

//Return the base card HTML for making new cards.
function getInfoCardHtml(card_id) {
    return `
    <p id=name></p>
    <p id=cpu_load></p>
    <p id=cpu_temp></p>
    `;
}


