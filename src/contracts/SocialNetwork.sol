pragma solidity ^0.5.0;

contract SocialNetwork {

    uint public postCount = 0;
    mapping(uint=>postCount) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address author;
    }


    function createPost(_content) public {
        postCount++;
        posts[postCount] = Post(postCount,_content,0,msg.sender)
    }


}