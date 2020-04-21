const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '5944bfdfa2274945a8f8eff5d109aec5'
});

const handleAPIcall = (req,res)=>{
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        }).catch(err => res.status(400).json('Unable to work with API'));
};

const handleImage = (req,res,db) => {
    {
        const { id } = req.body;
        db('users').where('id', '=', id)
            .increment('entries', 1)
            .returning('entries')
            .then(entries => {
                res.json(entries[0]);
            }).catch(err => res.status(400).json("Unable to get entries"));
    }
}


module.exports = {
    handleImage : handleImage,
    handleAPIcall : handleAPIcall
}