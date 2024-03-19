import { loginDto } from './dto/auth.input';
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service";

describe('AuthController',()=>{
    let controller: AuthController;
    let service: AuthService;

    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn().mockImplementation((loginDto:loginDto)=>{
                            if (loginDto.email === 'test' && loginDto.password === 'password123') {
                                return { statusCode: 201, message: '로그인에 성공하였습니다!' };
                            } else {
                                return { statusCode: 401, message: '유효하지 않습니다!' };
                            }
                        }),
                    },
                }
            ]
        }).compile();
        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    })



    it('should return a success mess if login is valid',async()=>{
        const dto = new loginDto();
        dto.email = 'test';
        dto.password = 'password123';

        const result = await controller.login(dto);
        expect(result).toEqual({statusCode:201, message:'로그인에 성공하였습니다!'});
    })

    it('should return error message if login is not valid',async()=>{
        const dto = new loginDto();
        dto.email = 'test';
        dto.password = 'wrong';
        const result = await controller.login(dto);
        expect(result).toEqual({statusCode:401, message: '유효하지 않습니다!'});
    })
})