

export const getUserDTO = (user) => {
    let newUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        gender: user.gender,
        age: user.age,
        role: user.role
    }
    return newUser
}