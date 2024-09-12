// Function to generate a random value for coordinates
function genValue() {
    // Generate a random integer between -55 and 55 (inclusive)
    return Math.floor(Math.random() * (55 - (-55) + 1)) + (-55);
}

// Initialize boss's x and z coordinates
var xz = [
    [genValue()],  // Randomly generate x coordinate
    [genValue()]   // Randomly generate z coordinate
];

// Initialize the x and z coordinates for three jerrys
var jerry1xz = [
    genValue(),  // Randomly generate jerry1's x coordinate
    genValue()   // Randomly generate jerry1's z coordinate
];

var jerry2xz = [
    genValue(),  // Randomly generate jerry2's x coordinate
    genValue()   // Randomly generate jerry2's z coordinate
];

var jerry3xz = [
    genValue(),  // Randomly generate jerry3's x coordinate
    genValue()   // Randomly generate jerry3's z coordinate
];

// Function to refresh the positions of all jerrys
function refreshJerrys(){
    // Generate new random positions and reset jerry1's x and z coordinates
    jerry1xz = [
        genValue(),  // Randomly generate new x coordinate for jerry1
        genValue()   // Randomly generate new z coordinate for jerry1
    ];

    // Generate new random positions and reset jerry2's x and z coordinates
    jerry2xz = [
        genValue(),  // Randomly generate new x coordinate for jerry2
        genValue()   // Randomly generate new z coordinate for jerry2
    ];

    // Generate new random positions and reset jerry3's x and z coordinates
    jerry3xz = [
        genValue(),  // Randomly generate new x coordinate for jerry3
        genValue()   // Randomly generate new z coordinate for jerry3
    ];
}
