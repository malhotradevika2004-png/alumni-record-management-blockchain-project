// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AlumniRecordManagement
 * @author B.Tech Final Year Project
 * @notice General-purpose decentralized Alumni Record and Academic Credential Management System
 * @dev Implements role-based access control, cryptographic integrity proofs, event emission,
 *      record revocation, and certificate verification on the Ethereum Virtual Machine (EVM).
 */
contract AlumniRecordManagement {
    // ------------------------------------------------------------------------
    // ENUMS & STRUCTS
    // ------------------------------------------------------------------------

    enum RecordStatus {
        Active,   // 0: Valid and verified
        Updated,  // 1: Updated with new verified information
        Revoked   // 2: Revoked by the institution (disciplinary/fraudulent)
    }

    struct Alumni {
        string alumniId;          // Unique institution ID (e.g., "ALU-2024-101")
        string name;              // Student's full legal name
        string degree;            // Degree title (e.g., "B.Tech Computer Science")
        string department;        // Academic department
        uint16 graduationYear;    // Year of graduation
        bytes32 dataHash;         // keccak256 hash of complete canonical off-chain record
        uint256 registrationDate; // Timestamp of initial blockchain registration
        uint256 lastUpdatedDate;  // Timestamp of last record update
        RecordStatus status;      // Current status: Active, Updated, or Revoked
        address alumniWallet;     // Linked wallet address of the alumni (if any)
        bool isRegistered;        // Existence flag
        string revocationReason;  // Reason if revoked
    }

    struct Certificate {
        string certificateId;     // Unique Certificate ID (e.g., "CERT-2024-8891")
        string alumniId;          // Linked Alumni ID
        string title;             // Certificate title (e.g., "Degree Certificate")
        string cgpaOrGrade;       // Academic standing (e.g., "8.9 / 10.0 CGPA")
        uint256 issueDate;        // Issuance timestamp
        bytes32 certHash;         // keccak256 hash of certificate payload & visual attributes
        address issuer;           // Wallet of the authorized issuer
        bool isRevoked;           // Revocation flag
        string revocationReason;  // Reason if revoked
        bool exists;              // Existence flag
    }

    // ------------------------------------------------------------------------
    // STATE VARIABLES
    // ------------------------------------------------------------------------

    address public institutionAdmin;
    string public institutionName;

    // Authorized staff/registrars who can issue certificates and register alumni
    mapping(address => bool) public isAuthorizedRegistrar;

    // Alumni ID => Alumni Record
    mapping(string => Alumni) private alumniRecords;

    // Array of all registered alumni IDs for enumeration
    string[] private allAlumniIds;

    // Certificate ID => Certificate Record
    mapping(string => Certificate) private certificates;

    // Array of all issued Certificate IDs
    string[] private allCertificateIds;

    // Alumni ID => List of linked Certificate IDs
    mapping(string => string[]) private alumniCertificates;

    // Aggregated statistics
    uint256 public totalAlumniCount;
    uint256 public totalCertificatesCount;
    uint256 public revokedCertificatesCount;
    uint256 public revokedAlumniCount;

    // ------------------------------------------------------------------------
    // EVENTS (Auditable on-chain transaction history)
    // ------------------------------------------------------------------------

    event AlumniRegistered(
        string indexed alumniId,
        string name,
        string degree,
        uint16 graduationYear,
        bytes32 dataHash,
        address indexed registeredBy,
        uint256 timestamp
    );

    event AlumniRecordUpdated(
        string indexed alumniId,
        bytes32 newDataHash,
        string newDegree,
        address indexed updatedBy,
        uint256 timestamp
    );

    event AlumniRecordRevoked(
        string indexed alumniId,
        string reason,
        address indexed revokedBy,
        uint256 timestamp
    );

    event AlumniRecordReinstated(
        string indexed alumniId,
        address indexed reinstatedBy,
        uint256 timestamp
    );

    event CertificateIssued(
        string indexed certificateId,
        string indexed alumniId,
        string title,
        bytes32 certHash,
        address indexed issuer,
        uint256 timestamp
    );

    event CertificateRevoked(
        string indexed certificateId,
        string indexed alumniId,
        string reason,
        address indexed revokedBy,
        uint256 timestamp
    );

    event RegistrarAuthorized(address indexed registrar, address indexed byAdmin, uint256 timestamp);
    event RegistrarRevoked(address indexed registrar, address indexed byAdmin, uint256 timestamp);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin, uint256 timestamp);

    // ------------------------------------------------------------------------
    // CUSTOM ERRORS (Gas-efficient EVM error handling)
    // ------------------------------------------------------------------------

    error OnlyAdminAllowed();
    error NotAuthorized();
    error AlumniAlreadyExists(string alumniId);
    error AlumniNotFound(string alumniId);
    error CertificateAlreadyExists(string certificateId);
    error CertificateNotFound(string certificateId);
    error EmptyIdentifier();
    error ZeroAddressProvided();

    // ------------------------------------------------------------------------
    // MODIFIERS
    // ------------------------------------------------------------------------

    modifier onlyAdmin() {
        if (msg.sender != institutionAdmin) revert OnlyAdminAllowed();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != institutionAdmin && !isAuthorizedRegistrar[msg.sender]) {
            revert NotAuthorized();
        }
        _;
    }

    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------

    constructor(string memory _institutionName) {
        institutionAdmin = msg.sender;
        institutionName = bytes(_institutionName).length > 0 ? _institutionName : "National Institute of Technology & Engineering";
        isAuthorizedRegistrar[msg.sender] = true;
    }

    // ------------------------------------------------------------------------
    // ADMIN MANAGEMENT FUNCTIONS
    // ------------------------------------------------------------------------

    function setInstitutionName(string calldata _name) external onlyAdmin {
        require(bytes(_name).length > 0, "Name cannot be empty");
        institutionName = _name;
    }

    function authorizeRegistrar(address _registrar) external onlyAdmin {
        if (_registrar == address(0)) revert ZeroAddressProvided();
        isAuthorizedRegistrar[_registrar] = true;
        emit RegistrarAuthorized(_registrar, msg.sender, block.timestamp);
    }

    function revokeRegistrar(address _registrar) external onlyAdmin {
        if (_registrar == address(0)) revert ZeroAddressProvided();
        isAuthorizedRegistrar[_registrar] = false;
        emit RegistrarRevoked(_registrar, msg.sender, block.timestamp);
    }

    function transferAdmin(address _newAdmin) external onlyAdmin {
        if (_newAdmin == address(0)) revert ZeroAddressProvided();
        address oldAdmin = institutionAdmin;
        institutionAdmin = _newAdmin;
        isAuthorizedRegistrar[_newAdmin] = true;
        emit AdminTransferred(oldAdmin, _newAdmin, block.timestamp);
    }

    // ------------------------------------------------------------------------
    // ALUMNI REGISTRATION & RECORD MANAGEMENT
    // ------------------------------------------------------------------------

    /**
     * @notice Register a newly graduated alumnus on the blockchain
     * @param _alumniId Unique identifier for the alumnus
     * @param _name Full legal name
     * @param _degree Degree completed
     * @param _department Department or major
     * @param _graduationYear Graduation year
     * @param _dataHash Cryptographic hash (keccak256) of complete student credentials
     * @param _alumniWallet Optional Ethereum address of the alumnus
     */
    function registerAlumni(
        string calldata _alumniId,
        string calldata _name,
        string calldata _degree,
        string calldata _department,
        uint16 _graduationYear,
        bytes32 _dataHash,
        address _alumniWallet
    ) external onlyAuthorized {
        if (bytes(_alumniId).length == 0) revert EmptyIdentifier();
        if (alumniRecords[_alumniId].isRegistered) revert AlumniAlreadyExists(_alumniId);

        alumniRecords[_alumniId] = Alumni({
            alumniId: _alumniId,
            name: _name,
            degree: _degree,
            department: _department,
            graduationYear: _graduationYear,
            dataHash: _dataHash,
            registrationDate: block.timestamp,
            lastUpdatedDate: block.timestamp,
            status: RecordStatus.Active,
            alumniWallet: _alumniWallet,
            isRegistered: true,
            revocationReason: ""
        });

        allAlumniIds.push(_alumniId);
        totalAlumniCount++;

        emit AlumniRegistered(
            _alumniId,
            _name,
            _degree,
            _graduationYear,
            _dataHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Update an existing alumni's academic record or hash
     * @dev Sets status to Updated and records the new dataHash
     */
    function updateAlumniRecord(
        string calldata _alumniId,
        string calldata _newDegree,
        string calldata _newDepartment,
        bytes32 _newDataHash,
        address _alumniWallet
    ) external onlyAuthorized {
        if (!alumniRecords[_alumniId].isRegistered) revert AlumniNotFound(_alumniId);

        Alumni storage record = alumniRecords[_alumniId];
        require(record.status != RecordStatus.Revoked, "Cannot update revoked record");

        record.degree = _newDegree;
        record.department = _newDepartment;
        record.dataHash = _newDataHash;
        if (_alumniWallet != address(0)) {
            record.alumniWallet = _alumniWallet;
        }
        record.lastUpdatedDate = block.timestamp;
        record.status = RecordStatus.Updated;

        emit AlumniRecordUpdated(_alumniId, _newDataHash, _newDegree, msg.sender, block.timestamp);
    }

    /**
     * @notice Revoke an alumni's record in case of academic misconduct or administrative cancellation
     */
    function revokeAlumniRecord(string calldata _alumniId, string calldata _reason) external onlyAuthorized {
        if (!alumniRecords[_alumniId].isRegistered) revert AlumniNotFound(_alumniId);

        Alumni storage record = alumniRecords[_alumniId];
        require(record.status != RecordStatus.Revoked, "Record already revoked");

        record.status = RecordStatus.Revoked;
        record.revocationReason = _reason;
        record.lastUpdatedDate = block.timestamp;
        revokedAlumniCount++;

        emit AlumniRecordRevoked(_alumniId, _reason, msg.sender, block.timestamp);
    }

    /**
     * @notice Reinstate an erroneously revoked alumni record
     */
    function reinstateAlumniRecord(string calldata _alumniId) external onlyAdmin {
        if (!alumniRecords[_alumniId].isRegistered) revert AlumniNotFound(_alumniId);

        Alumni storage record = alumniRecords[_alumniId];
        require(record.status == RecordStatus.Revoked, "Record is not revoked");

        record.status = RecordStatus.Active;
        record.revocationReason = "";
        record.lastUpdatedDate = block.timestamp;
        if (revokedAlumniCount > 0) {
            revokedAlumniCount--;
        }

        emit AlumniRecordReinstated(_alumniId, msg.sender, block.timestamp);
    }

    // ------------------------------------------------------------------------
    // CERTIFICATE ISSUANCE & VERIFICATION
    // ------------------------------------------------------------------------

    /**
     * @notice Issue a verifiable certificate tied to an alumni
     * @param _certificateId Unique certificate identifier
     * @param _alumniId Identifier of the registered alumnus
     * @param _title Title of the award or degree
     * @param _cgpaOrGrade Grade/CGPA/honors distinction
     * @param _certHash keccak256 hash of the complete certificate digital footprint
     */
    function issueCertificate(
        string calldata _certificateId,
        string calldata _alumniId,
        string calldata _title,
        string calldata _cgpaOrGrade,
        bytes32 _certHash
    ) external onlyAuthorized {
        if (bytes(_certificateId).length == 0) revert EmptyIdentifier();
        if (certificates[_certificateId].exists) revert CertificateAlreadyExists(_certificateId);
        if (!alumniRecords[_alumniId].isRegistered) revert AlumniNotFound(_alumniId);

        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            alumniId: _alumniId,
            title: _title,
            cgpaOrGrade: _cgpaOrGrade,
            issueDate: block.timestamp,
            certHash: _certHash,
            issuer: msg.sender,
            isRevoked: false,
            revocationReason: "",
            exists: true
        });

        allCertificateIds.push(_certificateId);
        alumniCertificates[_alumniId].push(_certificateId);
        totalCertificatesCount++;

        emit CertificateIssued(_certificateId, _alumniId, _title, _certHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Revoke an issued certificate
     */
    function revokeCertificate(string calldata _certificateId, string calldata _reason) external onlyAuthorized {
        if (!certificates[_certificateId].exists) revert CertificateNotFound(_certificateId);

        Certificate storage cert = certificates[_certificateId];
        require(!cert.isRevoked, "Certificate already revoked");

        cert.isRevoked = true;
        cert.revocationReason = _reason;
        revokedCertificatesCount++;

        emit CertificateRevoked(_certificateId, cert.alumniId, _reason, msg.sender, block.timestamp);
    }

    // ------------------------------------------------------------------------
    // PUBLIC VERIFICATION & QUERY FUNCTIONS (Free to call, no gas consumed)
    // ------------------------------------------------------------------------

    /**
     * @notice Public verification function for alumni record
     * @param _alumniId ID of alumnus to verify
     * @return isValid Boolean indicating whether record exists and is not revoked
     * @return record Complete Alumni struct
     */
    function verifyAlumni(string calldata _alumniId)
        external
        view
        returns (bool isValid, Alumni memory record)
    {
        record = alumniRecords[_alumniId];
        isValid = record.isRegistered && (record.status != RecordStatus.Revoked);
        return (isValid, record);
    }

    /**
     * @notice Public verification function for certificate
     * @param _certificateId Certificate ID to verify
     * @return isValid Boolean indicating whether certificate exists and is not revoked
     * @return cert Complete Certificate struct
     */
    function verifyCertificate(string calldata _certificateId)
        external
        view
        returns (bool isValid, Certificate memory cert)
    {
        cert = certificates[_certificateId];
        isValid = cert.exists && !cert.isRevoked;
        return (isValid, cert);
    }

    /**
     * @notice Retrieve raw alumni record
     */
    function getAlumni(string calldata _alumniId) external view returns (Alumni memory) {
        if (!alumniRecords[_alumniId].isRegistered) revert AlumniNotFound(_alumniId);
        return alumniRecords[_alumniId];
    }

    /**
     * @notice Retrieve raw certificate record
     */
    function getCertificate(string calldata _certificateId) external view returns (Certificate memory) {
        if (!certificates[_certificateId].exists) revert CertificateNotFound(_certificateId);
        return certificates[_certificateId];
    }

    /**
     * @notice Retrieve all certificate IDs issued to an alumnus
     */
    function getAlumniCertificates(string calldata _alumniId) external view returns (string[] memory) {
        return alumniCertificates[_alumniId];
    }

    /**
     * @notice Retrieve list of all registered alumni IDs
     */
    function getAllAlumniIds() external view returns (string[] memory) {
        return allAlumniIds;
    }

    /**
     * @notice Retrieve list of all issued Certificate IDs
     */
    function getAllCertificateIds() external view returns (string[] memory) {
        return allCertificateIds;
    }

    /**
     * @notice Quick aggregate statistics for dashboard
     */
    function getSystemStatistics()
        external
        view
        returns (
            uint256 _totalAlumni,
            uint256 _activeAlumni,
            uint256 _revokedAlumni,
            uint256 _totalCertificates,
            uint256 _activeCertificates,
            uint256 _revokedCertificates
        )
    {
        _totalAlumni = totalAlumniCount;
        _revokedAlumni = revokedAlumniCount;
        _activeAlumni = totalAlumniCount >= revokedAlumniCount ? totalAlumniCount - revokedAlumniCount : 0;
        _totalCertificates = totalCertificatesCount;
        _revokedCertificates = revokedCertificatesCount;
        _activeCertificates = totalCertificatesCount >= revokedCertificatesCount ? totalCertificatesCount - revokedCertificatesCount : 0;
    }
}

