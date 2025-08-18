// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Certifications is Ownable {
    struct Certificate {
        string name;
        string institution;
        string courseName;
        string role;
        uint256 completedHours;
        string identityDocument;
        string email;
    }

    mapping(string => Certificate) private userCertificates;

    event CertificateCreated(
        string identityDocument,
        string name,
        string institution,
        string courseName,
        string role,
        uint256 completedHours,
        string email
    );

    constructor() Ownable(msg.sender) {}

    function createCertificate(
        string memory _identityDocument,
        string memory _name,
        string memory _institution,
        string memory _courseName,
        string memory _role,
        uint256 _completedHours,
        string memory _email
    ) public onlyOwner {
        // Create certificate
        userCertificates[_identityDocument] = Certificate({
            name: _name,
            institution: _institution,
            courseName: _courseName,
            role: _role,
            completedHours: _completedHours,
            identityDocument: _identityDocument,
            email: _email
        });

        // Emit event
        emit CertificateCreated(
            _identityDocument,
            _name,
            _institution,
            _courseName,
            _role,
            _completedHours,
            _email
        );
    }

    function getCertificate(
        string memory identityDocument
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            string memory
        )
    {
        require(
            bytes(userCertificates[identityDocument].identityDocument).length !=
                0,
            "Certificate not found"
        );

        Certificate memory cert = userCertificates[identityDocument];
        return (
            cert.name,
            cert.institution,
            cert.courseName,
            cert.role,
            cert.completedHours,
            cert.email
        );
    }
}
