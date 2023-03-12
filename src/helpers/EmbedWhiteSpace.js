function EmbedWhiteSpace(count = 1) {
    let str = '';

    for(let i = 0; i < count; i ++) {
        str += "\n";
    }

    return str + "\u1CBC\u1CBC";
}

module.exports = EmbedWhiteSpace;