'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/api/auth';
import { useRouter } from 'next/navigation';
import UnAuthNavbar from '@/app/components/UnAuthNavbar';

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(64),
  })
  .required();
type FormData = z.infer<typeof schema>;

export default function RegisterRoute() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const mutation = useMutation(registerUser, {
    onSuccess: (data) => {
      console.log(data.data.access_token);
      localStorage.setItem('token', data.data.access_token);
      router.push('/dashboard');
    },
  });
  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <>
      <UnAuthNavbar />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} />
        <p>{errors.email?.message}</p>

        <input {...register('password')} />
        <p>{errors.password?.message}</p>

        <input type="submit" />
      </form>
      {mutation.isLoading && <p>Loading...</p>}
      {mutation.isError && <p>Please use another email</p>}
      {mutation.isSuccess && <p>Success!</p>}
    </>
  );
}
