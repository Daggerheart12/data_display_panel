window.setInterval(updatePage, 2000);



//Constant document elements.
const card_container = document.getElementById("card_container");
const data_path = "http://localhost:8080/data/data.json";

async function updatePage() {
    const data = await getJsonData()

    //Manage the number of cards being displayed.
    handleCardPopulation(data);
    updateCardData(data);
}



//Determine whether a card needs to be added or removed, and take appropriate action.
function handleCardPopulation(card_data) {
    current_total = card_container.children.length;
    required_cards = card_data.length;

    if (required_cards > current_total) {
        addNewCards(current_total, required_cards);
    }
    else if (required_cards < current_total) {
        removeLastCards(current_total, required_cards);
    }
}

//Add a new card.
function addNewCards(current_number, required_number) {
    //Go through each index, and create a new card with that ID.
    for (var i = current_number; i < required_number; i++) {
        console.info("Creating new card, with ID: " + i)
        //Create new card div.
        var new_card = document.createElement("div");
        //Assign card data.
        new_card.className = "data_card";
        new_card.id = i;
        //Assign default HTML.
        new_card.innerHTML = getDefaultCardHtml();

        //Append the new card to the card container object.
        card_container.appendChild(new_card);
    }
}

//Remove a card.
function removeLastCards(current_number, required_number) {
    //Go through each index, and delete the card with that ID.
    for (var i = current_number - 1; i > required_number - 1; i--) {
        console.info("Removing old card, with ID: " + i);
        document.getElementById(i).remove();
    }
}

function updateCardData(card_data) {
    var data_cards = card_container.getElementsByClassName("data_card");

    //Change the colour of the individual elements of each card.
    for (var i = 0; i < data_cards.length; i++) {

        
        //Change background colour.
        const data_card = document.getElementById(i);
        for (var j = 0; j < data_card.children.length; j++) {
            /*Children of the card div*/
            const child_element = data_card.children[j];
            /*console.log(child_element.id);*/
            
            /*Switch through each of the children*/
            switch (child_element.id) {
                /*Colour the background image*/
                case "background_svg":
                child_element.style.backgroundColor = getNewColour();
                break;

                /*Colour and change text of left side*/
                case "left":
                    for (var k = 0; k < child_element.children.length; k++) {
                        const image = child_element.children[k].children[0];
                        image.style.backgroundColor = getNewColour();

                        const text = child_element.children[k].children[1];
                        if (text != null) {
                            text.innerHTML = text.id;
                        }
                    }
                    break;
                /*Colour and change text of right side*/
                case "right":
                    for (var k = 0; k < child_element.children.length; k++) {
                        const image = child_element.children[k].children[0];
                        image.style.backgroundColor = getNewColour();

                        const text = child_element.children[k].children[1];
                        if (text != null) {
                            text.innerHTML = text.id;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
}

function getNewColour() {
    var rand = Math.floor(Math.random() * 3);

    switch (rand) {
        case 0:
            return "1ac095";
        case 1:
            return "faac06";
        case 2:
            return "e8253f";
        default:
            return "ffffff";

    }
}

async function interpretSystemData() {
    data = getJsonData()

    //Arbitrary baseline colour thresholds.
    system_temp = {"yellow": 60, "red": 80};    //Degrees.
    system_load = {"yellow": 70, "red": 90};    //Percent.
    ram_load = {"yellow": 70, "red": 90};       //Percent.
    fan_speed = {"yellow": 3000, "red": 5000};  //RPM.
    storage_usage = {"yellow": 75, "red": 90};  //Percent.

    if (data == null) {
        console.error("No data read from file");
        return null;
    }

    //


}

//Read data from /data/data.json using "data_path".
async function getJsonData() {
    //File path to data. This assumes that the server is hosting on port 8080, that could be a problem later.
    try {
        const response = await fetch(data_path);
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

//Return the default data card HTML.
//This function returns the internal HTML, the card div is handled when the new card is created.
function getDefaultCardHtml() {
    return `
    <img src="../../ui_assets/inverted_assets/background.svg" style="background-color: 1ac095;" class="background_svg" id="background_svg" alt="Background">
                    
    <!--Data card left-->
    <div class="data_card_left" id="left">
        <div class="name_field">
            <img src="../../ui_assets/inverted_assets/name_field.svg" style="background-color: 1ac095;" class="name_field_svg" id="name_field_svg" alt="Name Field">
            <p id="device_name_text">This is a test</p>
        </div>
                
        <div class="battery_icon">
            <img src="../../ui_assets/inverted_assets/battery_icon.svg" style="background-color: 1ac095;" class="battery_icon_svg" id="battery_icon" alt="Battery Icon">
        </div>
        
        <div class="storage_icon">
            <img src="../../ui_assets/inverted_assets/storage_icon.svg" style="background-color: 1ac095;" class="storage_icon_svg" id="storage_icon" alt="Storage Icon">
        </div>
        
        <div class="fan_icon">
            <img src="../../ui_assets/inverted_assets/fan_icon.svg" style="background-color: 1ac095;" class="fan_icon_svg" id="fan_icon" alt="Fan Icon">
        </div>
        
        <div class="gpu_icon">
            <img src="../../ui_assets/inverted_assets/gpu_icon.svg" style="background-color: 1ac095;" class="gpu_icon_svg" id="gpu_icon" alt="GPU Icon">
        </div>
        
        <div class="ram_icon">
            <img src="../../ui_assets/inverted_assets/ram_icon.svg" style="background-color: 1ac095;" class="ram_icon_svg" id="ram_icon" alt="RAM Icon">
        </div>
        
        <div class="cpu_icon">
            <img src="../../ui_assets/inverted_assets/cpu_icon.svg" style="background-color: 1ac095;" class="cpu_icon_svg" id="cpu_icon" alt="CPU Icon">
        </div>    
        <!--Data card left-->
    </div>

    <!--Data card right-->
    <div class="data_card_right" id="right">
        <div class="uptime_data_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="uptime_field_svg" alt="Uptime Field">
            <p id="uptime_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="storage_data_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="storage_field_svg" alt="Storage Field">
            <p id="storage_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="fan_data_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="fan_field_svg" alt="Fan Field">
            <p id="fan_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="gpu_data_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="gpu_field_svg" alt="GPU Field">
            <p id="gpu_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="ram_data_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="ram_field_svg" alt="RAM Field">
            <p id="ram_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="cpu_data_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="cpu_field_svg" alt="CPU Field">
            <p id="cpu_text" class="data_field_paragraph">This is a test</p>
        </div>

        <!--Data card right--> 
    </div>
    `;
}