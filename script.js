const svg = d3.select("svg");

const scaleFactor = 10;
const sizeFactor = 2;

// Selected bug
let selectedBug = null;
let selectedIndex = -1;

// Load data from the JSON file
d3.json("data.json").then(function(data) {
    // Check if data is loaded correctly
    console.log("Loaded data:", data);

    data.sort((a, b) => b.body - a.body);

    // Creazione di gruppi per ogni insetto
    const insects = svg.selectAll(".insect")
        .data(data)
        .enter()
        .append("g")
        .classed("insect", true)
        .attr("transform", d => `translate(${d.x * scaleFactor}, ${d.y * scaleFactor})`)
        .each(function(d, i) {
            d.originalColor = d.color;
            d.originalFill = "transparent"
            const insectGroup = d3.select(this);

            // Creazione del corpo
            insectGroup.append("ellipse")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("rx", d.body * sizeFactor)
                .attr("ry", (d.body / 2) * sizeFactor)
                .attr("fill", d.color)
                .attr("stroke", d.color)
                .on("click", function(event, d) {
                    console.log("Clicked on an insect", d);  // Debug
                    const thisElement = d3.select(this);
                    if (selectedBug !== null && selectedIndex === i) {
                        
                        // L'insetto già selezionato è cliccato nuovamente, deselezionalo
                        thisElement.attr("stroke-width", 1);  // Imposta lo stroke-width originale

                        selectedBug = null;
                        selectedIndex = -1;
                        updateInsects();  // Aggiorna la visualizzazione per riflettere la deselezione

                    } else if (selectedBug !== null && selectedIndex !== i) {
                        // Un insetto diverso è selezionato, scambia le proprietà...
                        let temp = JSON.parse(JSON.stringify(data[selectedIndex]));
                        data[selectedIndex].body = d.body;
                        data[selectedIndex].legs = d.legs;
                        data[selectedIndex].eyes = d.eyes;
                        d.body = temp.body;
                        d.legs = temp.legs;
                        d.eyes = temp.eyes;

                        // Ripristina il colore originale e lo stroke-width del bug precedentemente selezionato
                        d3.select(selectedBug.element)
                            .attr("stroke", selectedBug.originalColor)
                            .attr("stroke-width", 1);

                        thisElement.attr("stroke-width", 1);

                        // Aggiorna la visualizzazione
                        updateInsects();

                        // Imposta lo stroke-width di questo insetto a 1 e deseleziona
                        thisElement.attr("stroke-width", 1);
                        selectedBug = null;
                        selectedIndex = -1;

                    } else { // Prima selezione dell'insetto
                        if (selectedBug){
                             d3.select(selectedBug.element)
                                .attr("stroke-width", 1);
                        }
                        // Seleziona l'insetto
                        selectedBug = d;
                        selectedIndex = i;
                        selectedBug.color = "black";
                        d3.select(this)
                            .attr("stroke-width", 3);
                        updateInsects();
                        selectedBug.color = selectedBug.originalColor;
                        d3.select(this)
                            .attr("stroke-width", 1);
                    }
                });

            // Creazione degli occhi
            const eyeOffset = d.body * sizeFactor / 4;
            insectGroup.selectAll(null)
                .data([0, 1])
                .enter()
                .append("circle")
                .attr("cx", (d.body / 4) * sizeFactor)
                .attr("cy", (_, i) => i === 0 ? -eyeOffset : eyeOffset)
                .attr("r", d.eyes * sizeFactor / 2)
                .attr("fill", "white");

            // Creazione delle gambe
            [1/4, 1/2, 3/4].forEach(position => {
                const xPos = (position * d.body * sizeFactor) - (d.body / 2) * sizeFactor;
                const yOffset = (d.body / 2) * sizeFactor;
                const angle = position === 1/2 ? 0 : position < 1/2 ? -45 : 45;

                insectGroup.append("line")
                    .classed("leg upper", true)
                    .attr("x1", xPos)
                    .attr("y1", -yOffset)
                    .attr("x2", xPos)
                    .attr("y2", -yOffset - d.legs * sizeFactor)
                    .attr("stroke", d.color)
                    .attr("transform", `rotate(${angle}, ${xPos}, ${-yOffset})`);

                insectGroup.append("line")
                    .classed("leg lower", true)
                    .attr("x1", xPos)
                    .attr("y1", yOffset)
                    .attr("x2", xPos)
                    .attr("y2", yOffset + d.legs * sizeFactor)
                    .attr("stroke", d.color)
                    .attr("transform", `rotate(${-angle}, ${xPos}, ${yOffset})`);
            });
        });

    function updateInsects(){

            svg.selectAll(".insect").each(function(d){
            const insectGroup = d3.select(this);

            // Aggiorno il corpo
            insectGroup.select("ellipse")
                .transition()
                .duration(1000)
                .attr("stroke", d.color)
                .attr("stroke-width", d === selectedBug ? 3 : 1)
                .attr("rx", d.body * sizeFactor)
                .attr("ry", (d.body / 2) * sizeFactor);
            
            // Aggiorno gli occhi
            const eyeOffset = d.body * sizeFactor / 4;
            insectGroup.selectAll("circle")
                .transition()
                .duration(1000)
                .attr("r", d.eyes * sizeFactor / 2)
                .attr("cx", (d.body / 4) * sizeFactor)
                .attr("cy", (_, i) => i === 0 ? -eyeOffset : eyeOffset)
                .attr("stroke", d.color);


        const yOffset = (d.body / 2) * sizeFactor;
        const legLength = d.legs * sizeFactor;

            insectGroup.selectAll(".leg.upper")
                .each(function(){
                    const line = d3.select(this);
                    const xPos = parseFloat(line.attr("x1"));
                    const angle = line.attr("transform").match(/rotate\(([-\d.]+)/)[1];

                    line.attr("y1", -yOffset)  // Aggiorna y1 in base alle nuove dimensioni del corpo
                        .attr("y2", -yOffset - legLength)  // Aggiorna y2 per la lunghezza delle gambe
                        .attr("transform", `rotate(${angle}, ${xPos}, ${-yOffset})`)
                        .attr("stroke", d.color)
                        .attr("x1", xPos);
                });

            // Aggiornamento delle gambe inferiori
            insectGroup.selectAll(".leg.lower")
                .each(function() {
                    const line = d3.select(this);
                    const xPos = parseFloat(line.attr("x1"));
                    const angle = line.attr("transform").match(/rotate\(([-\d.]+)/)[1];

                line.attr("y1", yOffset)  // Aggiorna y1 in base alle nuove dimensioni del corpo
                    .attr("y2", yOffset + legLength)  // Aggiorna y2 per la lunghezza delle gambe
                    .attr("transform", `rotate(${angle}, ${xPos}, ${yOffset})`)
                    .attr("stroke", d.color)
                    
            });

        });
    }

    
}).catch(function(error) {
    console.log("Error loading the JSON file:", error);
    svg.append("text")
        .attr("x", 10)
        .attr("y", 50)
        .text("Error loading data");
});
