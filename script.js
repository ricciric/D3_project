const svg = d3.select("svg");

const scaleFactor = 10;
const sizeFactor = 2;

// Load data from the JSON file
d3.json("data.json").then(function(data) {
    // Check if data is loaded correctly
    console.log("Loaded data:", data);

    data.forEach(d => {
        // Calculate the offset for the eyes based on the size of the body
        const eyeOffset = d.body * sizeFactor / 4;

        // Draw the body
        svg.append("ellipse")
            .attr("cx", d.x * scaleFactor)
            .attr("cy", d.y * scaleFactor)
            .attr("rx", d.body * sizeFactor)
            .attr("ry", (d.body / 2) * sizeFactor)
            .attr("fill", "none")
            .attr("stroke", d.color);

        // Calculate the x-position of legs based on the position of the ellipse
        const xLegs = d.x * scaleFactor - (d.body / 2) * sizeFactor;

        // Draw the legs above and below the body
        [1/4, 1/2, 3/4].forEach(position => {
            let xPos;
            let legOffset = d.body * sizeFactor / 14;

            if (position === 1/2) {
                // Keep the central legs at 1/2 position of the ellipse
                xPos = xLegs + position * d.body * sizeFactor;

                // Upper legs
                svg.append("line")
                    .attr("x1", xPos)
                    .attr("y1", d.y * scaleFactor - (d.body / 2) * sizeFactor + (position === 1/4 || position === 3/4 ? legOffset : 0))
                    .attr("x2", xPos)
                    .attr("y2", d.y * scaleFactor - (d.body / 2) * sizeFactor - d.legs * sizeFactor)
                    .attr("stroke", d.color);

                // Lower legs
                svg.append("line")
                    .attr("x1", xPos)
                    .attr("y1", d.y * scaleFactor + (d.body / 2) * sizeFactor - (position === 1/4 || position === 3/4 ? legOffset : 0))
                    .attr("x2", xPos)
                    .attr("y2", d.y * scaleFactor + (d.body / 2) * sizeFactor + d.legs * sizeFactor)
                    .attr("stroke", d.color);

            } else if (position == 3/4) {
                // For other legs, add an offset to bring them closer to the ellipse
                const offset = (d.body / 4) * sizeFactor;
                xPos = xLegs + position * d.body * sizeFactor + (position > 1/2 ? offset : -offset);
                let angle_up = 45;
                let angle_down = -45;

                // Upper legs
                svg.append("line")
                    .attr("x1", xPos)
                    .attr("y1", d.y * scaleFactor - (d.body / 2) * sizeFactor + (position === 1/4 || position === 3/4 ? legOffset : 0))
                    .attr("x2", xPos)
                    .attr("y2", d.y * scaleFactor - (d.body / 2) * sizeFactor - d.legs * sizeFactor)
                    .attr("stroke", d.color)
                    .attr("transform", `rotate(${angle_up}, ${xPos}, ${d.y * scaleFactor - (d.body / 2) * sizeFactor})`);

                // Lower legs
                svg.append("line")
                    .attr("x1", xPos)
                    .attr("y1", d.y * scaleFactor + (d.body / 2) * sizeFactor - (position === 1/4 || position === 3/4 ? legOffset : 0))
                    .attr("x2", xPos)
                    .attr("y2", d.y * scaleFactor + (d.body / 2) * sizeFactor + d.legs * sizeFactor)
                    .attr("stroke", d.color)
                    .attr("transform", `rotate(${angle_down}, ${xPos}, ${d.y * scaleFactor + (d.body / 2) * sizeFactor})`);

            } else if (position == 1/4) {
                // For other legs, add an offset to bring them closer to the ellipse
                const offset = (d.body / 4) * sizeFactor;
                xPos = xLegs + position * d.body * sizeFactor + (position > 1/2 ? offset : -offset);
                let angle_up = -45;
                let angle_down = 45;

                // Upper legs
                svg.append("line")
                    .attr("x1", xPos)
                    .attr("y1", d.y * scaleFactor - (d.body / 2) * sizeFactor + (position === 1/4 || position === 3/4 ? legOffset : 0))
                    .attr("x2", xPos)
                    .attr("y2", d.y * scaleFactor - (d.body / 2) * sizeFactor - d.legs * sizeFactor)
                    .attr("stroke", d.color)
                    .attr("transform", `rotate(${angle_up}, ${xPos}, ${d.y * scaleFactor - (d.body / 2) * sizeFactor})`);

                // Lower legs
                svg.append("line")
                    .attr("x1", xPos)
                    .attr("y1", d.y * scaleFactor + (d.body / 2) * sizeFactor - (position === 1/4 || position === 3/4 ? legOffset : 0))
                    .attr("x2", xPos)
                    .attr("y2", d.y * scaleFactor + (d.body / 2) * sizeFactor + d.legs * sizeFactor)
                    .attr("stroke", d.color)
                    .attr("transform", `rotate(${angle_down}, ${xPos}, ${d.y * scaleFactor + (d.body / 2) * sizeFactor})`);
            }



        });

        // Draw the first eye
        svg.append("circle")
            .attr("cx", d.x * scaleFactor + (d.body / 4) * sizeFactor)
            .attr("cy", d.y * scaleFactor - (d.body / 4) * sizeFactor)
            .attr("r", d.eyes * sizeFactor / 2)
            .attr("fill", d.color);

        // Draw the second eye
        svg.append("circle")
            .attr("cx", d.x * scaleFactor + (d.body / 4) * sizeFactor)
            .attr("cy", d.y * scaleFactor + eyeOffset)
            .attr("r", d.eyes * sizeFactor / 2)
            .attr("fill", d.color);
    });
}).catch(function(error) {
    console.log("Error loading the JSON file:", error);
    svg.append("text")
        .attr("x", 10)
        .attr("y", 50)
        .text("Error loading data");
});
