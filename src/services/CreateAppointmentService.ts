import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import { Appointment } from '../models/Appointment';
import { AppointmentsRepository } from '../repositories/AppointmentsRepository';

interface IRequest {
  provider: string;
  parsedDate: Date;
}

export class CreateAppointmentService {
  public async execute({
    provider,
    parsedDate,
  }: IRequest): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(parsedDate);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new Error('this appointment already exists');
    }

    const appointment = await appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}
