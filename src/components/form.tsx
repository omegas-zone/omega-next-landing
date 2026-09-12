'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';

import { API_URL } from '@/lib/api';

import './_scss/form.scss';

type FormErrors = {
    name?: string;
    email?: string;
    message?: string;
};

export default function Form(): JSX.Element {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<FormErrors>({});

    const dialogRef = useRef<HTMLDialogElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === 'success' || status === 'error') {
            dialogRef.current?.showModal();
        }
    }, [status]);

    function closeDialog(focusForm = false): void {
        dialogRef.current?.close();
        setStatus('idle');

        if (focusForm) {
            firstInputRef.current?.focus();
        }
    }

    function clearError(field: keyof FormErrors): void {
        if (errors[field]) {
            setErrors((current) => {
                const next = { ...current };
                delete next[field];
                return next;
            });
        }
    }

    function validateForm(form: HTMLFormElement): FormErrors {
        const formData = new FormData(form);

        const name = String(formData.get('name') ?? '').trim();
        const email = String(formData.get('email') ?? '').trim();
        const message = String(formData.get('message') ?? '').trim();

        const newErrors: FormErrors = {};

        if (!name) {
            newErrors.name = 'Please enter your name.';
        }

        if (!email) {
            newErrors.email = 'Please enter your email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!message) {
            newErrors.message = 'Please enter a message.';
        }

        return newErrors;
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const newErrors = validateForm(form);

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstInvalidField = Object.keys(newErrors)[0] as keyof FormErrors;

            form.elements.namedItem(firstInvalidField);

            const field = form.elements.namedItem(firstInvalidField) as
                | HTMLInputElement
                | HTMLTextAreaElement
                | null;

            field?.focus();

            return;
        }

        setStatus('sending');

        const formData = new FormData(form);

        try {
            const response = await fetch(API_URL + '/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    website: formData.get('website'),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            form.reset();
            setErrors({});
            setStatus('success');
        } catch {
            setStatus('error');
        }
    }

    const isSuccess = status === 'success';

    return (<>
        <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={status === 'sending'}>
                <label>
                    <input
                        ref={firstInputRef}
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        aria-invalid={errors.name ? 'true' : undefined}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        onChange={() => clearError('name')}
                    />
                    {errors.name && (<p id="name-error" className="error">{errors.name}</p>)}
                </label>
                <label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        aria-invalid={errors.email ? 'true' : undefined}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        onChange={() => clearError('email')}
                    />
                    {errors.email && (<p id="email-error" className="error">{errors.email}</p>)}
                </label>
                <label>
                    <textarea
                        name="message"
                        placeholder="Message"
                        required
                        aria-invalid={errors.message ? 'true' : undefined}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        onChange={() => clearError('message')}
                    />
                    {errors.message && (
                        <p id="message-error" className="error">
                            {errors.message}
                        </p>
                    )}
                </label>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot"/>
                <button className="primary" type="submit">{status === 'sending' ? 'Sending…' : 'Send'}</button>
            </fieldset>
        </form>

        <dialog
            ref={dialogRef}
            className={'form-dialog ' + (isSuccess ? 'success' : 'error')}
            onCancel={() => closeDialog(isSuccess === false)}
        >
            <div className="content">
                <h2>
                    <span className="icon" aria-hidden="true">{isSuccess ? '✓' : '!'}</span>
                    {isSuccess ? 'Thanks!' : 'Something went wrong'}
                </h2>
                <p>{isSuccess ? 'Your message has been sent.' : 'Please try again.'}</p>
                <button className="primary" onClick={() => closeDialog(!isSuccess)}>
                    {isSuccess ? 'Close' : 'Try again'}
                </button>
            </div>
        </dialog>
    </>);
}