interface ControllerReturn<T> {
  body: UseCaseReturn<T>;
  headers: Record<String, String>;
  statusCode: number;
}

interface UseCaseReturn<T> extends DBAccessReturn<T> {}

interface DBAccessReturn<T> {
  success: boolean;
  data: T | undefined;
  error: unknown;
}
