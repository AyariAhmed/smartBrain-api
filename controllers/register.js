

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission!');
    }

    const saltRounds = 7;
    const hash = bcrypt.hashSync(password, saltRounds);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login').catch(err => res.json("Here was ...1"))
            .returning('email').catch(err => res.json("Here was ...2"))
            .then(loginEmail => {
                return trx('users')
                    .returning('*').catch(err => res.json("Here was ...3"))
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => res.json(user[0])).catch(err => res.json("Here was ...4"))

            })
            .then(trx.commit).catch(err => res.json("Here was ...1"))
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register !'));
}

module.exports = {
    handleRegister: handleRegister
};