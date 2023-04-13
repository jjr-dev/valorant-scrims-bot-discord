module.exports = (interaction, choices) => {
    return new Promise((resolve) => {
        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => (choice.startsWith(focusedValue) || choice == focusedValue));

        resolve(filtered.map(choice => ({ name: choice, value: choice })))
    })
}