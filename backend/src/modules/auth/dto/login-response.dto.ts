import type { UserDTO } 
    from "../../users/dto/user.dto.js";

import type { SessionDTO }
    from "./session.dto.js";

export interface LoginResponseDTO {

    user: UserDTO;

    session: SessionDTO;
}