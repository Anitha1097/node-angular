const Post = require("../models/post");

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        email: req.body.email,
        password: req.body.password,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        });
    });

}

exports.getPosts = (req, res, next) => {
    console.log(req.query);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    // const posts = [
    //     {
    //         id: 1,
    //         title: "First server-side data",
    //         content: "This is from server side!"
    //     },
    //     {
    //         id: 2,
    //         title: "Second server-side data",
    //         content: "This is from server side!"
    //     }
    // ];
    // res.status(200).json({
    //     'message': "Posts fetched successfully!",
    //     'posts': posts
    // });

    // postQuery.find().then(documents => {
    //   console.log(documents);
    //   res.status(200).json({
    //     message: "Posts fetched successfully!",
    //     posts: documents
    //   });
    // });

    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
}
exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(documents => {
        if (documents) {
            res.status(200).json(documents);
        } else {
            res.status(404).json({
                message: "Post not found",
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        });
    });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        console.log(result);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Deletion successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Deleting posts failed!"
        });
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        email: req.body.email,
        password: req.body.password,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    // console.log(post);
    Post.updateOne({ _id: req.body.id, creator: req.userData.userId }, post).then(result => {
            console.log(result);
            if (result.modifiedCount > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't udpate post!"
            });
        });
}