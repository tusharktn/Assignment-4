const Blog = require('../models/blogs.model');
const { find , save ,findOneAndUpdate , findOne} = require('../daos/index');


module.exports = {
    getById: async (req, res, next) => {
        try {
            const _id = req.params._id;
            const singleBlog = await findOne(Blog, _id);

            if (!singleBlog) {
                res.status(404).send(`Blog with id: ${id} not found!`);
            } else {
                res.send(singleBlog);
            }
        } catch (error) {
            next(error);
        }
    },
    getAll: async (req, res, next) => {
        try {
            const data = await find(Blog, {});
            res.status(200).send(data);
        } catch (error) {
            next(error);
        }
    },
    getByUser: async (req, res, next) => {
        try {
            const data = await find(Blog, { 'user.email': req.user.email });
            res.status(200).send(data);
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const { title, body } = req.body;

            if (!title || !body)
                return res
                    .status(400)
                    .json({ msg: 'Not all fields have been entered' });

            const user = {
                email: req.user.email
            }
                

            let newBlog = await save(Blog , {
                title,
                body,
                user
            });

            res.status(201).json(newBlog);
        } catch (error) {
            next(error);
        }
    },
    updateById: async (req, res, next) => {
        try {
            const _id = req.params._id;
            const updateRes = await findOneAndUpdate(Blog,  _id , req.body); 
            res.status(200).json(updateRes);
        } catch (error) {
            next(error);
        }
    },
    deleteById: async (req, res, next) => {
        try {
            const _id = req.params._id;
            const deletedItem = await findByIdAndDelete(Blog,_id); 
        } catch (error) {
            next(error);
        }
    }
}
