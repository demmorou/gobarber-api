import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';

import { Appointment } from '../models/Appointment';
import { AppointmentsRepository } from '../repositories/AppointmentsRepository';

interface IRequest {
  date: Date;
  provider_id: string;
}

export class CreateAppointmentService {
  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('this appointment already exists');
    }

    const appointment = await appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}
