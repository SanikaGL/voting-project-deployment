const logout = async (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Strict",
        secure: true
    });

    return res.status(200).json({
        message: "logged out successfully"
    });
};

module.exports = {
    logout
};  