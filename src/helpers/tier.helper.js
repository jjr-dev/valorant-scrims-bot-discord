const tiers = {
    iron: "Ferro",
    bronze: "Bronze",
    silver: "Prata",
    gold: "Ouro",
    platinum: "Platina",
    diamond: "Diamante",
    ascendant: "Ascendente",
    immortal: "Imortal",
    radiant: "Radiante"
};

module.exports = (tier = false) => {
    return tier ? tiers[tier.toLowerCase()] ?? false : tiers;
}