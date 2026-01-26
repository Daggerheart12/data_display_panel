window.setInterval(updatePage, 2000);



//Constant document elements.
const card_container = document.getElementById("card_container");
const data_path = "http://localhost:8080/server_system/data/data.json";

const green = "1ac095";
const yellow = "faac06";
const red = "e8253f";

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

var greens = 0;
var yellows = 0;
var reds = 0;

//Colour thresholds for icons that require average values.
const average = {"yellow": 8, "red": 12};    

//Update the colours and HTML content of data cards based on provided data.
function updateCardData(card_data) {
    var data_cards = card_container.getElementsByClassName("data_card");
    
    
    
    //Go through each individual card, and update its HTML data and style.
    for (var i = 0; i < data_cards.length; i++) {
        //Reset the counters.
        greens = 0;
        yellows = 0;
        reds = 0;

        //Get data.
        const required_data = Object.values(card_data[i]);
        const data_card = data_cards[i];

        //Get average status elements to restyle later.
        const background_svg = data_card.children[0];
        const device_name_svg = data_card.children[1].children[0].children[0];

        //Loop and switch through the child elements of the card, skipping the background.
        for (var j = 1; j < data_card.children.length; j++) {
            const child_element = data_card.children[j];
            
            /*Switch through each of the children*/
            switch (child_element.id) {
                /*Colour and change text of left side*/
                case "left":
                    for (var k = 0; k < child_element.children.length; k++) {
                        const image = child_element.children[k].children[0];

                        if (k > 0) {
                            image.style.backgroundColor = dataToColour(required_data, child_element.children[k].className);
                        }
                        
                        //Device name text.
                        const text = child_element.children[k].children[1];
                        if (text != null) {
                            text.innerHTML = required_data[0];
                        }
                    }
                    break;
                /*Colour and change text of right side*/
                case "right":
                    for (var k = 0; k < child_element.children.length; k++) {
                        const image = child_element.children[k].children[0];
                        image.style.backgroundColor = dataToColour(required_data, child_element.children[k].className);

                        const text = child_element.children[k].children[1];
                        if (text != null) {
                            text.innerHTML = dataToText(required_data, child_element.children[k].className);
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        //Now that everything else has been set, colour the elements that use average values.
        background_svg.style.backgroundColor = dataToAverageColour();
        device_name_svg.style.backgroundColor = dataToAverageColour();
    }
}

//Arbitrary baseline colour thresholds.
const system_temp = {"yellow": 60, "red": 80};    //Degrees.
const system_load = {"yellow": 70, "red": 90};    //Percent.
const ram_load = {"yellow": 70, "red": 90};       //Percent.
const fan_speed = {"yellow": 3000, "red": 5000};  //RPM.
const storage_usage = {"yellow": 30, "red": 10};  //Percent.
const battery_charge = {"yellow": 30, "red": 10}; //Percent.
const uptime = {"yellow": 259200, "red": 604800}; //Seconds.

//Check the data against the a above colour thresholds.
function dataToColour(data, current_element) {
    switch (current_element) {
        //Left side.
        case "battery_icon":
            //Check the battery status - green if charging.
            if (data[3] == "Charging") { return green; }
            //Check the charge of the battery.
            if (data[2] > battery_charge.yellow) { greens++; return green; }
            if (data[2] > battery_charge.red) { yellows++; return yellow;  }
            reds++;
            return red;
        case "storage_icon":
            //Check the remaining storage space as a percentage of the whole drive.
            var remaining_space = 100 - Math.floor((data[4] / data[5]) * 100);
            if (remaining_space < storage_usage.red) { reds++; return red; }
            if (remaining_space < storage_usage.yellow) { yellows++; return yellow; }
            greens++;
            return green;
        case "fan_icon":
            //Check the speed of the fan against the colour thresholds.
            if (data[6] > fan_speed.red) { reds++; return red; }
            if (data[6] > fan_speed.yellow) {yellows++; return yellow; }
            greens++;
            return green;
        case "gpu_icon":
            //Check the GPU load and temperature, and take the worst outcome.
            if (data[7] > system_load.red || data[8] > system_temp.red) {
                reds++;
                return red;
            }
            if (data[7] > system_load.yellow || data[8] > system_temp.yellow) {
                yellows++;
                return yellow;
            }
            greens++;
            return green;
        case "ram_icon":
            //Check the RAM load.
            var current_ram_load = Math.floor((data[9] / data[10]) * 100);
            if (current_ram_load > ram_load.red) { reds++; return red; }
            if (current_ram_load > ram_load.yellow) {yellows++; return yellow; }
            greens++;
            return green;
        case "cpu_icon":
            //Check the CPU load and temperature, and take the worst outcome.
            if (data[11] > system_load.red || data[12] > system_temp.red) {
                reds++;
                return red;
            }
            if (data[11] > system_load.yellow || data[12] > system_temp.yellow) {
                yellows++;
                return yellow;
            }
            greens++;
            return green;
        //Right side.
        case "battery_data_field":
            if (data[3] == "Charging") { return green; }
            if (data[2] > battery_charge.yellow) { return green; }
            if (data[2] > battery_charge.red) { return yellow; }
            return red;
        case "storage_data_field":
            //Check the remaining storage space as a percentage of the whole drive.
            var remaining_space = 100 - Math.floor((data[4] / data[5]) * 100);
            if (remaining_space < storage_usage.red) { return red; }
            if (remaining_space < storage_usage.yellow) { return yellow; }
            return green;
        case "fan_data_field":
            //Check the speed of the fan against the colour thresholds.
            if (data[6] > fan_speed.red) { return red; }
            if (data[6] > fan_speed.yellow) { return yellow; }
            return green;
        case "gpu_data_field":
            //Check the GPU load and temperature, and take the worst outcome.
            if (data[7] > system_load.red || data[8] > system_temp.red) {
                return red;
            }
            if (data[7] > system_load.yellow || data[8] > system_temp.yellow) {
                return yellow;
            }
            return green;
        case "ram_data_field":
            //Check the RAM load.
            var current_ram_load = Math.floor((data[9] / data[10]) * 100);
            if (current_ram_load > ram_load.red) { return red; }
            if (current_ram_load > ram_load.yellow) { return yellow; }
            return green;
        case "cpu_data_field":
            //Check the CPU load and temperature, and take the worst outcome.
            if (data[11] > system_load.red || data[12] > system_temp.red) {
                return red;
            }
            if (data[11] > system_load.yellow || data[12] > system_temp.yellow) {
                return yellow;
            }
            return green;
        default:
            return red;
    }
    
}

function dataToAverageColour() {
    var colour_value = 0;
    colour_value += greens;
    colour_value += yellows * 2;
    colour_value += reds * 4;

    if (colour_value < average.yellow) { return green; }
    if (colour_value < average.red) { return yellow; }
    return red;
}

//Fill text fields using provided data.
function dataToText(data, current_element) {
    switch (current_element) {
        case "battery_data_field":
            if (data[3] == "Charging") {
                return ("Battery - charging at " + data[2] + "%");
            }
            return ("Battery - draining at " + data[2] + "%");
        case "storage_data_field":
            return ("Storage - using " + data[4] + "GB of " + data[5]);
        case "fan_data_field":
            return ("Fan - " + data[6] + "RPM");
        case "gpu_data_field":
            return ("GPU - " + data[7] + "% at " + data[8] + " degrees")
        case "ram_data_field":
            return ("RAM - using " + data[9] + " GB of " + data[10] + "GB");
        case "cpu_data_field":
            return ("CPU - " + data[10] + "% at " + data[11] + " degrees")
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



//Read data from /data/data.json using "data_path".
async function getJsonData() {
    //File path to data. This assumes that the server is hosting on port 8080, that could be a problem later.
    try {
        const response = await fetch("http://localhost:8080/server_system/data/data.json");
        console.log(data_path);
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
        <div class="battery_data_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="uptime_field_svg" alt="Uptime Field">
            <p id="battery_text" class="data_field_paragraph">This is a test</p>
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