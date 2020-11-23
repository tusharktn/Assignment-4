module.exports = {

    find: async (model, query) => await model.find(query),

    
    findOne: async (model, query) => await model.findOne(query),

    save: async (model, data) => {
        const newData = new model(data);
        return await newData.save();
    },

    findOneAndUpdate: async (model, filter, data) => await model.findOneAndUpdate(filter, data),

    
    findOneAndDelete: async (model, filter) => await model.findOneAndDelete(filter)

};
