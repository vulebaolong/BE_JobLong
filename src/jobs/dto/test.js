const createLikes = async (req, res) => {
    const { res_id } = req.query.res_id;
    const { user_id } = req.query.data_like;
    const { data_like } = req.query.user_id;
    const result = await model.like_res.create({ user_id, res_id, data_like });
    res.statusCode(200).json(result);
};
