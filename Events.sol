// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventRegistry {
    address public organizer;

    struct Event {
        uint256 eventId;
        string organizerId;
        string title;
        string description;
        string imageUrl;
        string date;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    event EventAdded(uint256 indexed eventId, string organizerId, string title, string description, string imageUrl, string date);

    constructor() {
        organizer = msg.sender;
    }

    function addEvent(
        string memory _organizerId, // Changed to string
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        string memory _date
    ) public {
        eventCount++;
        events[eventCount] = Event(eventCount, _organizerId, _title, _description, _imageUrl, _date);
        emit EventAdded(eventCount, _organizerId, _title, _description, _imageUrl, _date);
    }

    function getEvent(uint256 _eventId)
        public
        view
        returns (
            string memory, // Changed return type to string
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        require(_eventId > 0 && _eventId <= eventCount, "Invalid event ID");
        Event memory eventInfo = events[_eventId];
        return (eventInfo.organizerId, eventInfo.title, eventInfo.description, eventInfo.imageUrl, eventInfo.date);
    }

    function getAllEvents()
        public
        view
        returns (Event[] memory)
    {
        Event[] memory allEvents = new Event[](eventCount);
        for (uint256 i = 1; i <= eventCount; i++) {
            allEvents[i - 1] = events[i];
        }
        return allEvents;
    }

    function getEventCount() public view returns (uint256) {
        return eventCount;
    }
}
