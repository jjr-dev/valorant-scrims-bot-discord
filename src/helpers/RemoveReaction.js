async function RemoveReaction(reaction, user = false) {
    if(user)
        reaction.users.remove(typeof user === 'object' ? user.id : user)
            .catch((err) => {
                if (err.status !== 404)
                    console.log(err);
            });
    else
        reaction.remove()
            .catch((err) => {
                if (err.status !== 404)
                    console.log(err);
            });
}

module.exports = RemoveReaction;