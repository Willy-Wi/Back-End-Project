const { query } = require('./dbCon');

const updatepost = async (req, res) => {
    const { title, description } = req.body;
    let errTitle, errDesc;
    if (!(title.length >= 5 && title.length <= 255)) {
        errTitle = "Title length must be between 5 and 255 characters";
    }

    if (!(description.length >= 5 && description.length <= 1000)) {
        errDesc = "Description length must be between 5 and 1000 characters";
    }

    if (errTitle) {
        res.json({
            status: 404,
            error: errTitle,
        });
    } else if(errDesc){
        res.json({
            status: 404,
            error: errDesc,
        });
    } else{
        let sql = "UPDATE posts SET post_title = '" + title + "', post_content = '" + description + "' WHERE post_id='" + req.params.id + "'";
        await query(sql);
        res.json({
            status: 200,
        });
    }
};

module.exports = { updatepost };