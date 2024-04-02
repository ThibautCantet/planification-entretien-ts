export class Result<T> {
    private constructor(private readonly _status: 'SUCCESS' | 'FAILURE', private readonly data: T) {
    }

    static ofSuccess<T>(data: T): Result<T> {
        return new Result<T>('SUCCESS', data);
    }

    static ofFailure<T>(failureData: T): Result<T> {
        return new Result('FAILURE', failureData);
    }

    isSuccess(): boolean {
        return this._status === 'SUCCESS';
    }
    value(): T {
        return this.data;
    }


    get status(): "SUCCESS" | "FAILURE" {
        return this._status;
    }
}