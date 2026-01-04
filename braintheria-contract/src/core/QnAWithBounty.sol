// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {QnAAsk} from "./QnAAsk.sol";
import {QnAAnswer} from "./QnAAnswer.sol";
import {QnAAdmin} from "./QnAAdmin.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract QnAWithBounty is QnAAsk, QnAAnswer, QnAAdmin, ReentrancyGuard {
    //Add event here (so backend can catch it)
    event QuestionAsked(
        uint256 indexed questionId,
        address indexed asker,
        uint256 bounty,
        string uri
    );

    constructor(address _owner) QnAAdmin(_owner) {}

    /**
     * @notice Ask a new question with optional ETH bounty
     */
    function askQuestion(
        address token,
        uint256 bounty,
        uint40 deadline,
        string calldata uri
    ) external payable whenNotPaused nonReentrant returns (uint256) {
        // Call internal logic from QnAAsk
        uint256 questionId = _askQuestion(token, bounty, deadline, uri);

        //Emit event so backend can parse it
        emit QuestionAsked(questionId, msg.sender, bounty, uri);

        return questionId;
    }

    /**
     * @notice Ask a question on behalf of a user (only owner/backend can call)
     * @dev User must approve this contract to spend their BRAIN tokens first
     * @param asker The actual user who is asking the question
     * @param token Token address for bounty payment
     * @param bounty Bounty amount in wei
     * @param deadline Deadline timestamp
     * @param uri IPFS URI for question content
     */
    function askQuestionOnBehalf(
        address asker,
        address token,
        uint256 bounty,
        uint40 deadline,
        string calldata uri
    ) external onlyOwner whenNotPaused nonReentrant returns (uint256) {
        require(asker != address(0), "Invalid asker");
        
        // Call internal logic with asker as the question owner
        uint256 questionId = _askQuestionOnBehalf(asker, token, bounty, deadline, uri);

        emit QuestionAsked(questionId, asker, bounty, uri);

        return questionId;
    }

    function answerQuestion(
        uint256 questionId,
        string calldata uri
    ) external whenNotPaused {
        _postAnswer(questionId, uri);
    }

    /**
     * @notice Answer a question on behalf of a user (only owner/backend can call)
     * @dev Records the actual user's wallet as the answerer so bounty goes to them
     * @param answerer The actual user who is answering the question
     * @param questionId ID of the question to answer
     * @param uri IPFS URI for answer content
     */
    function answerQuestionOnBehalf(
        address answerer,
        uint256 questionId,
        string calldata uri
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(answerer != address(0), "Invalid answerer");
        return _postAnswerOnBehalf(answerer, questionId, uri);
    }

    /**
     * @notice Accept answer - only the question asker can call this
     * @dev This is for users who want to accept answers directly from their wallet
     */
    function acceptAnswer(
        uint256 questionId,
        uint256 answerId
    ) external onlyAsker(questionId) nonReentrant {
        _acceptAnswer(questionId, answerId);
    }

    /**
     * @notice Accept answer as admin - only contract owner (backend) can call this
     * @dev This allows your backend to accept answers on behalf of users
     * Add this function to fix the "Not asker" error
     */
    function acceptAnswerAsAdmin(
        uint256 questionId,
        uint256 answerId
    ) external onlyOwner nonReentrant {
        _acceptAnswer(questionId, answerId);
    }

    /**
     * @notice Get the current bounty amount for a question
     * @param questionId The ID of the question
     * @return The bounty amount in wei
     */
    function bountyOf(uint256 questionId) external view returns (uint256) {
        require(questionId < questionCounter, "Question does not exist");
        return questions[questionId].bounty;
    }

    function addBounty(
        uint256 questionId,
        uint256 amount
    ) external payable nonReentrant {
        _addBounty(questionId, amount);
    }

    /**
     * @notice Add bounty on behalf of a user (only owner/backend can call)
     * @dev User must approve this contract to spend their BRAIN tokens first
     * @param funder The user who is funding the additional bounty
     * @param questionId ID of the question
     * @param amount Amount to add to bounty
     */
    function addBountyOnBehalf(
        address funder,
        uint256 questionId,
        uint256 amount
    ) external onlyOwner whenNotPaused nonReentrant {
        require(funder != address(0), "Invalid funder");
        _addBountyOnBehalf(funder, questionId, amount);
    }

    function reduceBounty(
        uint256 questionId,
        uint256 newAmount
    ) external nonReentrant onlyAsker(questionId) {
        _reduceBounty(questionId, newAmount);
    }

    /**
     * @notice Reduce bounty as admin - only contract owner (backend) can call this
     * @dev Refunds the difference to the original asker's wallet
     * @param questionId ID of the question
     * @param newAmount New bounty amount (lower than current)
     */
    function reduceBountyAsAdmin(
        uint256 questionId,
        uint256 newAmount
    ) external onlyOwner nonReentrant {
        _reduceBounty(questionId, newAmount);
    }

    // 🔹 Added: externals to match your tests
    function refundExpired(
        uint256 questionId
    ) external onlyAsker(questionId) nonReentrant {
        _refundExpired(questionId);
    }

    function cancelQuestion(
        uint256 questionId
    ) external onlyAsker(questionId) nonReentrant {
        _cancelQuestion(questionId);
    }

    /**
     * @notice Cancel question as admin - only contract owner (backend) can call this
     * @dev Refunds bounty to the original asker's wallet
     * @param questionId ID of the question
     */
    function cancelQuestionAsAdmin(
        uint256 questionId
    ) external onlyOwner nonReentrant {
        _cancelQuestion(questionId);
    }

    // views
    function getQuestion(uint256 id) external view returns (Question memory) {
        return questions[id];
    }

    function getAnswer(
        uint256 qid,
        uint256 aid
    ) external view returns (Answer memory) {
        return answers[qid][aid];
    }
}
