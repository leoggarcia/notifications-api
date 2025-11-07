import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should call mailerService.sendMail with the correct parameters', async () => {
      const email = 'test@example.com';
      const subject = 'Test Subject';
      const description = 'Test Description';

      await service.sendEmail(email, subject, description);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: subject,
        html: `
                <h1>¡Hola!</h1>
                <p>${description}</p>
            `,
      });
    });
  });
});
