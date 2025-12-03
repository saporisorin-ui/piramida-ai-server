// random_forest_predictor.js

const fs = require("fs");

function loadModel(path = "model.json") {
    const raw = fs.readFileSync(path);
    return JSON.parse(raw);
}

function predictSingleTree(tree, features) {
    let node = 0;

    while (tree.children_left[node] !== -1) {
        const featureIndex = tree.feature[node];
        const threshold = tree.threshold[node];

        if (features[featureIndex] <= threshold) {
            node = tree.children_left[node];
        } else {
            node = tree.children_right[node];
        }
    }

    // return the class distribution at the leaf
    return tree.value[node][0];
}

function predictForest(model, features) {
    const votes = Array(model.n_classes).fill(0);

    for (const tree of model.trees) {
        const result = predictSingleTree(tree, features);

        for (let i = 0; i < model.n_classes; i++) {
            votes[i] += result[i];
        }
    }

    // final class = argmax of votes
    let maxIndex = 0;
    for (let i = 1; i < votes.length; i++) {
        if (votes[i] > votes[maxIndex]) maxIndex = i;
    }

    return {
        prediction: model.classes[maxIndex],
        confidence: votes[maxIndex] / votes.reduce((a, b) => a + b, 0),
        rawVotes: votes
    };
}

module.exports = {
    loadModel,
    predictForest
};
