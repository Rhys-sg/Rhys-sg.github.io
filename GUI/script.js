const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const svgContainer = document.querySelector('.graph');

const svgWidth = svgContainer.clientWidth;
const svgHeight = svgContainer.clientHeight;
const horizontalMargin = 50;
const upperMargin = 50; 
const lowerMargin = 100; 
const graphMargin = 50;

const y_axis_height = (svgHeight - (upperMargin + lowerMargin))/2;
const x_axis_width = svgWidth - (horizontalMargin * 2);

// Define the coordinates for the current graph
const current_x1 = horizontalMargin;
const current_y1 = upperMargin;
const current_x2 = x_axis_width + horizontalMargin;
const current_y2 = y_axis_height + upperMargin;

// Define the coordinates for the goal graph
const goal_x1 = current_x1;
const goal_y1 = current_y1 + y_axis_height + graphMargin;
const goal_x2 = current_x2;
const goal_y2 = current_y2 + y_axis_height + graphMargin;

// Retrieve upper and lower graph containers
const upperGraphContainer = document.querySelector('.upperGraph');
const lowerGraphContainer = document.querySelector('.lowerGraph');

// Create SVG elements for upper and lower graphs
const upperGraphSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const lowerGraphSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

// Define SVG width and height
const inner_svgWidth = upperGraphContainer.clientWidth;
const inner_svgHeight = upperGraphContainer.clientHeight;

// Define dimensions for upper graph
const upperGraphWidth = svgWidth;
const upperGraphHeight = svgHeight / 2;

// Define dimensions for lower graph
const lowerGraphWidth = svgWidth;
const lowerGraphHeight = svgHeight / 2;

// Update SVG attributes for upper graph
upperGraphSvg.setAttribute("width", upperGraphWidth);
upperGraphSvg.setAttribute("height", upperGraphHeight);

// Update SVG attributes for lower graph
lowerGraphSvg.setAttribute("width", lowerGraphWidth);
lowerGraphSvg.setAttribute("height", lowerGraphHeight);

// Append SVG elements to their respective containers
upperGraphContainer.appendChild(upperGraphSvg);
lowerGraphContainer.appendChild(lowerGraphSvg);

// Global map to keep track of sortable elements by name
const liMap = new Map();

// Global map to keep track of sortable elements by masses
const mass_li = new Map();

// Global map to keep track of what mass corresponds to the sums
const massMap = new Map();

document.addEventListener("DOMContentLoaded", function() {

    // ---------------------------------------------------------------------------------------- //
    //                             Dynamically Creates Sortable List                            //
    // ---------------------------------------------------------------------------------------- //

    const AMINO_ACID_COUNT = 6;

    const container = document.querySelector('.sortable-list');    
    
    // Function to create a list item with the specified structure
    function createListItem(id, name) {
        const li = document.createElement('li');
        li.classList.add('item');
        li.setAttribute('draggable', 'true');
        li.id = id; // Set id for reference

        const div = document.createElement('div');
        div.classList.add('details');

        const span = document.createElement('span');

        const h2 = document.createElement('h2');
        h2.id = 'name' + id;
        h2.innerHTML = name; // Set name content

        const spanNumber = document.createElement('span');
        spanNumber.id = 'mass' + id;

        span.appendChild(h2);
        span.appendChild(spanNumber);
        div.appendChild(span);
        li.appendChild(div);

        // Store li in liMap with name as key
        liMap.set(id, li);

        return li;
    }


    // Create a list item for each AMINO_ACID_COUNT, dynamically and append them to the container
    for (let i = 1; i <= AMINO_ACID_COUNT; i++) {
        const listItem = createListItem(i);
        container.appendChild(listItem);
    }    

    

    // ---------------------------------------------------------------------------------------- //
    //                                   Amino Acid Functionality                               //
    // ---------------------------------------------------------------------------------------- //

    // Initialize amino acid map
    const amino_acids = new Map([
      ['A', 71.03711], ['C', 103.00919], ['D', 115.02694],
      ['E', 129.04259], ['F', 147.06841], ['G', 57.02146],
      ['H', 137.05891], ['I', 113.08406], ['K', 128.09496],
      ['L', 113.08406], ['M', 131.04049], ['N', 114.04293],
      ['P', 97.05276], ['Q', 128.05858], ['R', 156.10111],
      ['S', 87.03203], ['T', 101.04768], ['V', 99.06841],
      ['W', 186.07931], ['Y', 163.06333]
    ]);

  
    // // Function to generate a random list of amino acid names
    // function getgoal_peptide() {
    //   let names = [...amino_acids.keys()];
    //   let goal_peptide = [];
  
    //   for (let i = 0; i < AMINO_ACID_COUNT; i++) {
    //     let randint = Math.floor(Math.random() * names.length)
    //     goal_peptide.push(names[randint]);
    //   }
      
    //   return goal_peptide;
    // }


    // Function to generate a random list of amino acid names without repeating amino acids
    function getgoal_peptide() {
        let names = [...amino_acids.keys()];
        let goal_peptide = [];

        while (goal_peptide.length < AMINO_ACID_COUNT) {
            let randint = Math.floor(Math.random() * names.length);
            let aminoAcid = names[randint];
            if (!goal_peptide.includes(aminoAcid)) {
                goal_peptide.push(aminoAcid);
            }
        }
        
        return goal_peptide;
      }
    

  
    // Function to shuffle an array
    function shuffleArray(array) {
      return array.sort(() => Math.random() - 0.5);
    }

  
    // Function to update the visual based on a list of amino acid names
    function initializateVisual(current_peptide) {
      for (let i = 0; i < current_peptide.length; i++) {
        document.getElementById('name' + (i + 1)).innerHTML = current_peptide[i];
        document.getElementById('mass' + (i + 1)).innerHTML = amino_acids.get(current_peptide[i]);

        const key = amino_acids.get(current_peptide[i]);
        const value = liMap.get(i + 1);

        if (mass_li.has(key)) {
            const existingList = mass_li.get(key);
            existingList.push(value);
            mass_li.set(key, existingList);
        } else {
            mass_li.set(key, [value]);
        }
      }
    }
  
    // Get a random list of amino acid names, copy it, and shuffle the copy to create the visual list
    const goal_peptide = getgoal_peptide();
    const current_peptide = [...goal_peptide];
    shuffleArray(current_peptide);

  
    // Update the visual list
    initializateVisual(current_peptide);


    // ---------------------------------------------------------------------------------------- //
    //                                  Sortable List Functionality                             //
    // ---------------------------------------------------------------------------------------- //


    // Function to initialize the sortable list
    function initSortableList(e) {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
    
        if (!draggingItem) {
            return; // Exit if draggingItem is not found
        }
    
        // Getting all items except currently dragging and making array of them
        let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
    
        // Finding the sibling after which the dragging item should be placed
        let nextSibling = siblings.find(sibling => {
            return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
        });
    
        if (!nextSibling) {
            return; // Exit if nextSibling is not found
        }
    
        // Inserting the dragging item before the found sibling
        sortableList.insertBefore(draggingItem, nextSibling);
    }
    
    
    // Required to track the last moved element
    function createAndHideInputElement() {
        const elementNameInput = document.createElement('input');
        elementNameInput.setAttribute('type', 'text');
        elementNameInput.setAttribute('class', 'element-name-input');
        elementNameInput.setAttribute('placeholder', 'Change name');
        elementNameInput.style.display = 'none';
        document.querySelector('.container').appendChild(elementNameInput);

        elementNameInput.addEventListener('change', function(evt) {
            sortable.sortable('refresh');
        });
    }
    

    // Initialize the map of sortable elements to amino acids
    function sortableToAminoAcids(initialSequence) {
        let sortableToAminoAcids = new Map();
        for (let i = 0; i < initialSequence.length; i++) {
            sortableToAminoAcids.set(initialSequence[i], current_peptide[i]);
        }
        return sortableToAminoAcids;
    }


    // Initialize instance of SortableJS
    const sortableList = document.querySelector('.sortable-list');
    createAndHideInputElement();


    // Create a new SortableJS instance
    const sortable = new Sortable(sortableList, {
        animation: 150,
        onSort: function (evt) {
            const order = sortable.toArray();
            const aminoSequence = order.map(item => sortableToAminoAcidsMap.get(item));
            updateGraph(aminoSequence);
        }
    });

    // Event listener for when the name of the last moved element changes
    const elementNameInput = document.querySelector('.element-name-input');
    elementNameInput.addEventListener('change', function(evt) {
        sortable.sortable('refresh');
    });    


    // Map the initial sequence to amino acid names
    const initialSequence = sortable.toArray();
    const sortableToAminoAcidsMap = sortableToAminoAcids(initialSequence);


    // Add event listeners for drag and drop functionality    
    sortableList.addEventListener("dragover", initSortableList);
    sortableList.addEventListener("dragenter", e => e.preventDefault());

    // ---------------------------------------------------------------------------------------- //
    //                                  Graph Functionality                                     //
    // ---------------------------------------------------------------------------------------- //

    // Simulates mass spectrometry from a given peptide
    //     Returns a list of subpeptide masses
    function generateSubpeptideMasses(peptide) {
        const n = peptide.length;
        
        const leftSums = [];
        const rightSums = [];
        const sumMap = new Map();

        // Calculate leftSums
        for (let i = 1; i < n; i++) {
            const sliceArray = peptide.slice(0, i + 1);
            const sumLeft = sliceArray.reduce((acc, curr) => acc + curr, 0);
            leftSums.push(parseFloat(sumLeft.toFixed(5)));

            // Add values to the map
            if (!sumMap.has(sumLeft)) {
                sumMap.set(sumLeft, sliceArray);
            } else {
                const existingValues = sumMap.get(sumLeft);
                existingValues.push(peptide[i]); // Add the current value to the existing array
                sumMap.set(sumLeft, existingValues);
            }
        }

        // Calculate rightSums
        for (let i = 1; i < n - 1; i++) {
            const sliceArray = peptide.slice(i);
            const sumRight = sliceArray.reduce((acc, curr) => acc + curr, 0);
            rightSums.push(parseFloat(sumRight.toFixed(5)));

            // Add values to the map
            if (!sumMap.has(sumRight)) {
                sumMap.set(sumRight, sliceArray);
            } else {
                const existingValues = sumMap.get(sumRight);
                existingValues.push(peptide[i]); // Add the current value to the existing array
                sumMap.set(sumRight, existingValues);
            }
        }

        rightSums.reverse();
    
        const combinedSums = mergeSortedLists(leftSums, rightSums);
    
        return [combinedSums, sumMap];
    }
    
    // Helper function to merge two sorted lists
    function mergeSortedLists(left, right) {
        const merged = [];
        let i = 0, j = 0;
    
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                merged.push(left[i]);
                i++;
            } else {
                merged.push(right[j]);
                j++;
            }
        }
    
        while (i < left.length) {
            merged.push(left[i]);
            i++;
        }
    
        while (j < right.length) {
            merged.push(right[j]);
            j++;
        }
    
        return merged;
    }
    
    // ---------------------------------------------------------------------------------------- //
    //                                  Graph Functionality                                     //
    // ---------------------------------------------------------------------------------------- //

    
    function createAxis(lowerGraphSvg, upperGraphSvg) {

        // draw axis for the current masses
        _createAxis(upperGraphSvg, 1, 1, 1, inner_svgHeight, "2");
        _createAxis(upperGraphSvg, 1, inner_svgHeight, inner_svgWidth, inner_svgHeight, "2");

        // draw axis for the goal masses
        _createAxis(lowerGraphSvg, 1, 1, 1, inner_svgHeight, "2");
        _createAxis(lowerGraphSvg, 1, inner_svgHeight, inner_svgWidth, inner_svgHeight, "2");
    }
    
    // Helper function to create an axis line
    function _createAxis(svg, x1, y1, x2, y2, thinkness) {
        const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axis.setAttribute("x1", x1);
        axis.setAttribute("y1", y1); 
        axis.setAttribute("x2", x2); 
        axis.setAttribute("y2", y2);
        axis.setAttribute("stroke", "black");
        axis.setAttribute("stroke-width", thinkness);
        svg.appendChild(axis);
    }

    // Function to create bars with labels
    function createBars(svg, current_masses, other_masses, color1, color2, sumMap, goal){
        const barWidth = 7;
        const distance_at_end = 50;
        const label_height_difference = 25;
        const maxValue = Math.max(...current_masses.concat(other_masses));
        const width = inner_svgWidth - distance_at_end;
        const seed = generateSeed(current_masses);
    
        // Iterate over the first values array to create bars with color1 and labels
        for (let i = 0; i < current_masses.length; i++) {
            const height = pseudoRandomIntInRange(Math.floor(current_masses[i]) + seed, 100, 200);
            const y = inner_svgHeight;
            const x = current_masses[i] / maxValue * width;
    
            // Create the bar rectangle
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", barWidth);
            rect.setAttribute("height", 0);
            rect.setAttribute("fill", current_masses[i] !== other_masses[i] ? color1 : color2);

    
            // Create the text element
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x);
            text.setAttribute("y", y + label_height_difference);
            text.setAttribute("font-size", "16");
            text.setAttribute("text-anchor", "middle");
            text.textContent = current_masses[i];
            text.style.visibility = "hidden";
    
            // Event listeners to show/hide text on hover
            rect.addEventListener("mouseover", function() {
                text.style.visibility = "visible";
            });
    
            rect.addEventListener("mouseout", function() {
                text.style.visibility = "hidden";
                changeItemColor(current_masses[i], sumMap, "grey", "grey", "1px")
                
            });

            // Event listener to highlight amino acids
            rect.addEventListener("click", function() {
                if (current_masses[i] === other_masses[i]) { 
                    changeItemColor(current_masses[i], sumMap, "green", "orange","2px")
                } else {
                    changeItemColor(current_masses[i], sumMap,  "red", "orange", "2px")
                }
            });

    
            // Append rect and text elements to the SVG
            svg.appendChild(rect);
            svg.appendChild(text);

            drawBar(rect, y, height, i);

            if (current_masses === other_masses) {
                confetti();
            }
        }
    }
    
    // Function to change the color of the amino acid list items
    function changeItemColor(mass, sumMap, color1, color2, width) {
        // Iterate over the sumMap to find the mass
        sumMap.forEach(function(list) {
            // Check if the mass is equal to the sum of the list
            if (list.reduce((partialSum, a) => partialSum + a, 0).toFixed(5) == mass) {
                // Iterate over the list to change the color of repeating masses
                list.forEach(function(mass) {
                    // Change the base color for the list items
                    // if (mass_li.get(mass).length == 1) {
                        mass_li.get(mass)[0].style.borderColor = color1;
                        mass_li.get(mass)[0].style.borderWidth = width;
                    //     return;
                    // }
                    // // Change the base color for the list items
                    // for (let i = 0; i < mass_li.get(mass).length; i++) {
                    //     mass_li.get(mass)[i].style.borderColor = color2;
                    //     mass_li.get(mass)[i].style.borderWidth = width;
                    // }
                });
            }
        });
    }

    // Function to concatenate the tens place values of a list of floats
    function generateSeed(floats) {
        var nums = [];
        for (var i = 0; i < floats.length; i++) {
            var hundreds = Math.floor(floats[i] / 10) % 10;
            nums.push(hundreds);
        }
        var concatenatedInteger = parseInt(nums.join(''));
    
        return concatenatedInteger;
    }

    // Function to generate a pseudo-random integer in a given range using a seed
    function pseudoRandomIntInRange(seed, min, max) {
        var a = 1103515245;
        var c = 12345;
        var m = Math.pow(2, 31);
    
        seed = (a * seed + c) % m;
        var random = seed / m;
        return Math.floor(min + random * (max - min + 1));
    }

    // Animate the bar growth
    function drawBar(rect, y , height, i) {
        rect.style.transition = "y .35s, height .35s";
        setTimeout(() => {
            rect.setAttribute("y", y - height);
            rect.setAttribute("height", height);
        }, 100 * i);
    }

    // Animate the bar shrinkage
    function undrawBar(rect, i) {
        const currentHeight = parseFloat(rect.getAttribute("height"));
        rect.style.transition = "height .35s, y .35s";
        setTimeout(() => {
            rect.setAttribute("height", "0");
            rect.setAttribute("y", parseFloat(rect.getAttribute("y")) + currentHeight);
        }, 100 * i);

        // Remove the bar after the transition ends
        rect.addEventListener("transitionend", function() {
            rect.remove();
        });
    }

    // Function to create confetti
    function confetti() {
        // Pass in the id of an element
        let confetti = new Confetti('demo');

        // Edit given parameters
        confetti.setCount(75);
        confetti.setSize(1);
        confetti.setPower(25);
        confetti.setFade(false);
        confetti.destroyTarget(true);
    }

    // Initialize the graph with axes and bars
    function initializeGraph(current_masses, goal_masses, current_sumMap, goal_sumMap) {
        createAxis(lowerGraphSvg, upperGraphSvg);
        createBars(upperGraphSvg, current_masses, goal_masses, "red", "green", current_sumMap, false);
        createBars(lowerGraphSvg, goal_masses, current_masses, "black", "black", goal_sumMap, true);
    }

    // Function to update the graph based on the new masses
    function updateGraph(aminoSequence) {
        const [update_current_masses, current_sumMap] = generateSubpeptideMasses(aminoSequence.map(amino => amino_acids.get(amino)));
        
        // Clear existing bars
        const bar_svgContainer = document.querySelector('.upperGraph');
        const bars = bar_svgContainer.querySelectorAll('rect');

        for (let i = 0; i < bars.length; i++) {
            undrawBar(bars[i], i);
        }

        // Update the bars
        createBars(upperGraphSvg, update_current_masses, goal_masses, "red", "green", current_sumMap, false);
    }

    const sortableListHeight = sortableList.offsetHeight;
    svgContainer.style.height = sortableListHeight + (AMINO_ACID_COUNT * 11) + 30 + 'px';

    // Generate the subpeptide masses for the current and goal peptides
    var [current_masses, current_sumMap] = generateSubpeptideMasses(current_peptide.map(amino => amino_acids.get(amino)));
    var [goal_masses, goal_sumMap] = generateSubpeptideMasses(goal_peptide.map(amino => amino_acids.get(amino)));

    // Initialize the graph with axes and bars
    initializeGraph(current_masses, goal_masses, current_sumMap, goal_sumMap);
});
  

