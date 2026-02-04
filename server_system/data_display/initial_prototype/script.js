window.setInterval(updatePage, 2000);



//Constant document elements.
const card_container = document.getElementById("card_container");
const data_path = "http://localhost:8080/server_system/data/data.json";



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




//Update the colours and HTML content of data cards based on provided data.
function updateCardData(card_data) {
    var data_cards = card_container.getElementsByClassName("data_card");

    //Ensure the safety of incoming data.
    card_data = sanitiseJsonData(card_data);

    //Loop through each individual card, and update its HTML data and style.
    for (var i = 0; i < data_cards.length; i++) {
        //Reset the counters.
        greens = 0;
        yellows = 0;
        reds = 0;

        //Get data.
        const required_data = card_data[i];
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
                    var icon = null;
                    var field_txt = null;

                    //Name field.
                    field_txt = child_element.querySelector("#name_field").children[1];
                    field_txt.innerHTML = dataToText([required_data.device_name], "name_field");

                    //Battery icon.
                    icon = child_element.querySelector("#battery_icon").children[0];
                    icon.style.backgroundColor = dataToColour([required_data.battery_charge, required_data.battery_status], "battery_icon");

                    //Storage icon.
                    icon = child_element.querySelector("#storage_icon").children[0];
                    icon.style.backgroundColor = dataToColour([required_data.disk_space_used, required_data.total_disk_space], "storage_icon");
                    
                    //Fan icon.
                    icon = child_element.querySelector("#fan_icon").children[0];
                    icon.style.backgroundColor = dataToColour([required_data.fan_speed], "fan_icon");
                    
                    //GPU icon.
                    icon = child_element.querySelector("#gpu_icon").children[0];
                    icon.style.backgroundColor = dataToColour([required_data.gpu_load, required_data.gpu_load], "gpu_icon");
                    
                    //RAM icon.
                    icon = child_element.querySelector("#ram_icon").children[0];
                    icon.style.backgroundColor = dataToColour([required_data.ram_load, required_data.total_ram_space], "ram_icon");

                    //CPU icon.
                    icon = child_element.querySelector("#cpu_icon").children[0];
                    icon.style.backgroundColor = dataToColour([required_data.cpu_load, required_data.cpu_temp], "cpu_icon");
                    
                    break;

                /*Colour and change text of right side*/
                case "right":
                    var field_bg = null;
                    var field_txt = null;

                    //Battery field.
                    field_bg = child_element.querySelector("#battery_field").children[0];
                    field_txt = child_element.querySelector("#battery_field").children[1];
                    field_bg.style.backgroundColor = dataToColour([required_data.battery_charge, required_data.battery_status], "battery_data_field");
                    field_txt.innerHTML = dataToText([required_data.battery_charge, required_data.battery_status], "battery_data_field");

                    //Storage field.
                    field_bg = child_element.querySelector("#storage_field").children[0];
                    field_txt = child_element.querySelector("#storage_field").children[1];
                    field_bg.style.backgroundColor = dataToColour([required_data.disk_space_used, required_data.total_disk_space], "storage_data_field");
                    field_txt.innerHTML = dataToText([required_data.disk_space_used, required_data.total_disk_space], "storage_data_field");

                    //Fan field.
                    field_bg = child_element.querySelector("#fan_field").children[0];
                    field_txt = child_element.querySelector("#fan_field").children[1];
                    field_bg.style.backgroundColor = dataToColour([required_data.fan_speed], "fan_data_field");
                    field_txt.innerHTML = dataToText([required_data.fan_speed], "fan_data_field");

                    //GPU field.
                    field_bg = child_element.querySelector("#gpu_field").children[0];
                    field_txt = child_element.querySelector("#gpu_field").children[1];
                    field_bg.style.backgroundColor = dataToColour([required_data.gpu_load, required_data.gpu_temp], "gpu_data_field");
                    field_txt.innerHTML = dataToText([required_data.gpu_load, required_data.gpu_temp], "gpu_data_field");

                    //RAM field.
                    field_bg = child_element.querySelector("#ram_field").children[0];
                    field_txt = child_element.querySelector("#ram_field").children[1];
                    field_bg.style.backgroundColor = dataToColour([required_data.ram_load, required_data.total_ram_space], "ram_data_field");
                    field_txt.innerHTML = dataToText([required_data.ram_load, required_data.total_ram_space], "ram_data_field");

                    //CPU field.
                    field_bg = child_element.querySelector("#cpu_field").children[0];
                    field_txt = child_element.querySelector("#cpu_field").children[1];
                    field_bg.style.backgroundColor = dataToColour([required_data.cpu_load, required_data.cpu_temp], "cpu_data_field");
                    field_txt.innerHTML = dataToText([required_data.cpu_load, required_data.cpu_temp], "cpu_data_field");

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


/*
Colour the UI elements based on data provided. Ensure that the data is not null,
then choose a colour by comparing data against provied thresholds.
Change the text of data fields based on provided data.
*/

var greens = 0;
var yellows = 0;
var reds = 0;


//Arbitrary baseline colour thresholds.
const system_temp = {"yellow": 60, "red": 80};    //Degrees.
const system_load = {"yellow": 70, "red": 90};    //Percent.
const ram_load = {"yellow": 70, "red": 90};       //Percent.
const fan_speed = {"yellow": 3000, "red": 5000};  //RPM.
const storage_usage = {"yellow": 30, "red": 10};  //Percent.
const battery_charge = {"yellow": 30, "red": 10}; //Percent.
const uptime = {"yellow": 259200, "red": 604800}; //Seconds.

//Colour thresholds for icons that require average values.
const average = {"yellow": 8, "red": 12};  

//Colour definitions.
const green = "1ac095";
const yellow = "faac06";
const red = "e8253f";
const white = "ffffff";

//Check the data against the a above colour thresholds.
function dataToColour(data, current_element) {
    switch (current_element) {
        //Left side.
        case "battery_icon":        //data = [battery_charge, battery_status]
            if (data[0] == null || data[1] == null) { return white; }
            if (data[1] == "Charging") { greens++; return green; }
            if (data[0] > battery_charge.yellow) { greens++; return green; }
            if (data[0] > battery_charge.red) { yellows++; return yellow;  }
            reds++;
            return red;

        case "storage_icon":        //data = [disk_space_used, total_disk_space]
            if (data[0] == null || data[1] == null) { return white; }

            var remaining_space = 100 - Math.floor((data[0] / data[1]) * 100);
            if (remaining_space < storage_usage.red) { reds++; return red; }
            if (remaining_space < storage_usage.yellow) { yellows++; return yellow; }
            greens++;
            return green;

        case "fan_icon":            //data = [fan_speed]
            if (data[0] == null) { return white; }
            if (data[0] > fan_speed.red) { reds++; return red; }
            if (data[0] > fan_speed.yellow) {yellows++; return yellow; }
            greens++;
            return green;

        case "gpu_icon":            //data = [gpu_load, gpu_temp]
            if (data[0] == null || data[1] == null) { return white; }
            if (data[0] > system_load.red || data[1] > system_temp.red) {
                reds++;
                return red;
            }
            if (data[0] > system_load.yellow || data[1] > system_temp.yellow) {
                yellows++;
                return yellow;
            }
            greens++;
            return green;

        case "ram_icon":            //data = [ram_load, total_ram_space]
            if (data[0] == null || data[1] == null) { return white; }

            var current_ram_load = Math.floor((data[0] / data[1]) * 100);
            if (current_ram_load > ram_load.red) { reds++; return red; }
            if (current_ram_load > ram_load.yellow) {yellows++; return yellow; }
            greens++;
            return green;

        case "cpu_icon":            //data = [cpu_load, cpu_temp]
            if (data[0] == null || data[1] == null) { return white; }
            if (data[0] > system_load.red || data[1] > system_temp.red) {
                reds++;
                return red;
            }
            if (data[0] > system_load.yellow || data[1] > system_temp.yellow) {
                yellows++;
                return yellow;
            }
            greens++;
            return green;

        //Right side.
        case "battery_data_field":  //data = [battery_charge, battery_status]
            if (data[0] == null || data[1] == null) { return white; }
            if (data[1] == "Charging") { return green; }
            if (data[0] > battery_charge.yellow) { return green; }
            if (data[0] > battery_charge.red) { return yellow;  }
            return red;

        case "storage_data_field":  //data = [disk_space_used, total_disk_space]
            if (data[0] == null || data[1] == null) { return white; }

            var remaining_space = 100 - Math.floor((data[0] / data[1]) * 100);
            if (remaining_space < storage_usage.red) { return red; }
            if (remaining_space < storage_usage.yellow) { return yellow; }
            return green;

        case "fan_data_field":      //data = [fan_speed]
            if (data[0] == null) { return white; }
            if (data[0] > fan_speed.red) { reds++; return red; }
            if (data[0] > fan_speed.yellow) {yellows++; return yellow; }
            return green;

        case "gpu_data_field":      //data = [gpu_load, gpu_temp]
            if (data[0] == null || data[1] == null) { return white; }
            if (data[0] > system_load.red || data[1] > system_temp.red) { return yellow; }
            if (data[0] > system_load.yellow || data[1] > system_temp.yellow) { return yellow; }
            return green;
            
        case "ram_data_field":      //data = [ram_load, total_ram_space]
            if (data[0] == null || data[1] == null) { return white; }

            var current_ram_load = Math.floor((data[0] / data[1]) * 100);
            if (current_ram_load > ram_load.red) { return red; }
            if (current_ram_load > ram_load.yellow) { return yellow; }
            return green;

        case "cpu_data_field":      //data = [cpu_load, cpu_temp]
            if (data[0] == null || data[1] == null) { return white; }
            if (data[0] > system_load.red || data[1] > system_temp.red) { return red; }
            if (data[0] > system_load.yellow || data[1] > system_temp.yellow) { return yellow; }
            return green;

        default:
            console.error(current_element)
            return white;
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
        case "name_field":          //data = [device_name]
            if (data[0] == null) { return "Data not found"; }
            return data[0];

        case "battery_data_field":  //data = [battery_charge, battery_status]
            if (data[0] == null || data[1] == null) { return "Data not found" }
            else if (data[1] == "Charging") {
                return ("Battery - charging at " + data[0] + "%");
            }
            return ("Battery - draining at " + data[0] + "%");

        case "storage_data_field":  //data = [disk_space_used, total_disk_space]
            if (data[0] == null || data[1] == null) { return "Data not found" }
            return ("Disk - using " + data[0] + "GB of " + data[1] + "GB");

        case "fan_data_field":      //data = [fan_speed]
            if (data[0] == null) { return "Data not found" }
            return ("Fan - " + data[0] + "RPM");

        case "gpu_data_field":      //data = [gpu_load, gpu_temp]
            if (data[0] == null || data[1] == null) { return "Data not found" }
            return ("GPU - " + data[0] + "% at " + data[1] + " degrees")

        case "ram_data_field":      //data = [ram_load, total_ram_space]
            if (data[0] == null || data[1] == null) { return "Data not found" }
            return ("RAM - using " + data[0] + "GB of " + data[1] + "GB")

        case "cpu_data_field":      //data = [cpu_load, cpu_temp]
            if (data[0] == null || data[1] == null) { return "Data not found" }
            return ("CPU - " + data[0] + "% at " + data[1] + " degrees")
    }
}

/*
Handle JSON data. 
Get JSON data from the master data file.
Sanitise data before it is used to update the UI.
*/

//Read data from /data/data.json using "data_path".
async function getJsonData() {
    //File path to data. This assumes that the server is hosting on port 8080, that could be a problem later.
    try {
        const response = await fetch("http://localhost:8080/server_system/data/data.json");
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

//Loop through all the data, and ensure that it is as expected.
function sanitiseJsonData(card_data) {
    for (var i = 0; i < card_data.length; i++) {
        //Device name. String.
        if (typeof card_data[i].device_name !== "string") {
            card_data[i].device_name = "Unknown Device"; 
        }

        //Device uptime. Int.
        card_data[i].uptime = is_int(card_data[i].uptime, []);
        
        //Battery charge. Int.
        card_data[i].battery_charge = is_int(card_data[i].battery_charge, [0, 100]);
        
        //Battery status. String.
        if (typeof card_data[i].battery_status !== "string") {
            card_data[i].battery_status = null; 
        }

        //Disk space used. Int (bytes).
        card_data[i].disk_space_used = is_int(card_data[i].disk_space_used, []);
        if (card_data[i].disk_space_used != null) {
            card_data[i].disk_space_used = Math.round(card_data[i].disk_space_used / 1000000000);
        }

        //Disk space total. Int (bytes).
        card_data[i].total_disk_space = is_int(card_data[i].total_disk_space, []);
        if (card_data[i].total_disk_space != null) {
            card_data[i].total_disk_space = Math.round(card_data[i].total_disk_space / 1000000000);
        }

        //Fan speed. Int.
        card_data[i].fan_speed = is_int(card_data[i].fan_speed, []);

        //GPU load. Int.
        card_data[i].gpu_load = is_int(card_data[i].gpu_load, [0, 100])
        
        //GPU Temp. Int.
        card_data[i].gpu_temp = is_int(card_data[i].gpu_temp, [])

        //RAM load. Int (bytes).
        card_data[i].ram_load = is_int(card_data[i].ram_load, []);
        if (card_data[i].ram_load != null) {
            card_data[i].ram_load = Math.round(card_data[i].ram_load / 1000000000);
        }

        //RAM space total. Int (bytes).
        card_data[i].total_ram_space = is_int(card_data[i].total_ram_space, []);
        if (card_data[i].total_ram_space != null) {
            card_data[i].total_ram_space = Math.round(card_data[i].total_ram_space / 1000000000);
        }

        //CPU load. Int.
        card_data[i].cpu_load = is_int(card_data[i].cpu_load, [0, 100]);

        //CPU temp. Int.
       card_data[i].cpu_temp = is_int(card_data[i].cpu_temp, []);

    }
    return card_data;
}

//Return null if not an int, or an int within range.
//If the value is a float, make it an int.
function is_int(value, range) {
    if (Number.isInteger(value) == false) {
        if (typeof value === "number" && !isNaN(value)) {
            value = Math.round(value);
        }
        else {
            return null;
        }
    }
    
    if (range.length > 0) {
        if ((range[0] <= value <= range[1]) == false) {
            return null;
        }
    }

    return value;
}


/*
Store and return the HTML base of data cards. This function is called when a new card needs to be made.
*/

//This function returns the internal HTML, the card div is handled when the new card is created.
function getDefaultCardHtml() {
    return `
    <img src="../../ui_assets/inverted_assets/background.svg" style="background-color: 1ac095;" class="background_svg" id="background_svg" alt="Background">
                    
    <!--Data card left-->
    <div class="data_card_left" id="left">
        <div class="name_field" id="name_field">
            <img src="../../ui_assets/inverted_assets/name_field.svg" style="background-color: 1ac095;" class="name_field_svg" id="name_field_svg" alt="Name Field">
            <p id="device_name_text">This is a test</p>
        </div>
                
        <div class="battery_icon" id="battery_icon">
            <img src="../../ui_assets/inverted_assets/battery_icon.svg" style="background-color: 1ac095;" class="battery_icon_svg" id="battery_icon" alt="Battery Icon">
        </div>
        
        <div class="storage_icon" id="storage_icon">
            <img src="../../ui_assets/inverted_assets/storage_icon.svg" style="background-color: 1ac095;" class="storage_icon_svg" id="storage_icon" alt="Storage Icon">
        </div>
        
        <div class="fan_icon" id="fan_icon">
            <img src="../../ui_assets/inverted_assets/fan_icon.svg" style="background-color: 1ac095;" class="fan_icon_svg" id="fan_icon" alt="Fan Icon">
        </div>
        
        <div class="gpu_icon" id="gpu_icon">
            <img src="../../ui_assets/inverted_assets/gpu_icon.svg" style="background-color: 1ac095;" class="gpu_icon_svg" id="gpu_icon" alt="GPU Icon">
        </div>
        
        <div class="ram_icon" id="ram_icon">
            <img src="../../ui_assets/inverted_assets/ram_icon.svg" style="background-color: 1ac095;" class="ram_icon_svg" id="ram_icon" alt="RAM Icon">
        </div>
        
        <div class="cpu_icon" id="cpu_icon">
            <img src="../../ui_assets/inverted_assets/cpu_icon.svg" style="background-color: 1ac095;" class="cpu_icon_svg" id="cpu_icon" alt="CPU Icon">
        </div>    
        <!--Data card left-->
    </div>

    <!--Data card right-->
    <div class="data_card_right" id="right">
        <div class="battery_data_field" id="battery_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="uptime_field_svg" alt="Uptime Field">
            <p id="battery_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="storage_data_field" id="storage_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="storage_field_svg" alt="Storage Field">
            <p id="storage_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="fan_data_field" id="fan_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="fan_field_svg" alt="Fan Field">
            <p id="fan_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="gpu_data_field" id="gpu_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="gpu_field_svg" alt="GPU Field">
            <p id="gpu_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="ram_data_field" id="ram_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="ram_field_svg" alt="RAM Field">
            <p id="ram_text" class="data_field_paragraph">This is a test</p>
        </div>

        <div class="cpu_data_field" id="cpu_field">
            <img src="../../ui_assets/inverted_assets/data_field.svg" style="background-color: 1ac095;" class="data_field_svg" id="cpu_field_svg" alt="CPU Field">
            <p id="cpu_text" class="data_field_paragraph">This is a test</p>
        </div>

        <!--Data card right--> 
    </div>
    `;
}

