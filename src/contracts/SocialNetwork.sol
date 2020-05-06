pragma solidity ^0.5.0;


contract SocialNetwork {
    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;

    struct Post {
        uint256 id;
        string content;
        uint256 tipAmount;
        address payable author;
    }

    event PostCreated(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    event PostTipped(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    function createPost(string memory _content) public {
        postCount++;
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        emit PostCreated(postCount, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        // Fetch the post and store it in memory
        Post memory _post = posts[_id];
        // Fetch the author and store it in memory
        address payable _author = _post.author;
        // Transfer money to Author
        address(_author).transfer(msg.value)
        // Update the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the original post from the memory _post
        posts[_id] = _post

        emit PostTipped(_id,_post.content,_post.tipAmount,_post.author)
    }

}
