function roleToString(role) {
    if (role < 1) return "elu"
    if (role < 10) return "agriculteur"
    if (role < 14) return "élu"
    return "gestionnaire"
}

export default roleToString