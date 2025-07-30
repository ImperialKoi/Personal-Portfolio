# TypeScript Tips for Better Developer Experience

*Published: December 10, 2023*

TypeScript continues to evolve, bringing new features that can significantly improve your development experience. Here are some advanced tips and techniques I've learned while building large-scale applications.

## 1. Template Literal Types

Create powerful string manipulation types:

```typescript
type Route = `/api/${'users' | 'posts' | 'comments'}/${string}`;

// Valid routes
const userRoute: Route = '/api/users/123';
const postRoute: Route = '/api/posts/abc';

// TypeScript error!
const invalidRoute: Route = '/api/products/123';
```

## 2. Mapped Types for Form Validation

Build type-safe form validation:

```typescript
type User = {
  name: string;
  email: string;
  age: number;
};

type ValidationErrors<T> = {
  [K in keyof T]?: string[];
};

type UserErrors = ValidationErrors<User>;
// Result: { name?: string[]; email?: string[]; age?: string[]; }

const validateUser = (user: User): UserErrors => {
  const errors: UserErrors = {};
  
  if (!user.name) {
    errors.name = ['Name is required'];
  }
  
  if (!user.email.includes('@')) {
    errors.email = ['Invalid email format'];
  }
  
  return errors;
};
```

## 3. Conditional Types for API Responses

Handle different response types based on parameters:

```typescript
type ApiResponse<T extends 'success' | 'error'> = T extends 'success'
  ? { status: 'success'; data: any }
  : { status: 'error'; message: string };

const handleResponse = <T extends 'success' | 'error'>(
  type: T
): ApiResponse<T> => {
  if (type === 'success') {
    return { status: 'success', data: {} } as ApiResponse<T>;
  } else {
    return { status: 'error', message: 'Something went wrong' } as ApiResponse<T>;
  }
};
```

## 4. Utility Types for Better APIs

Create utility types for cleaner APIs:

```typescript
// Make certain properties optional
type PartialUser = Partial<Pick<User, 'name' | 'email'>> & 
  Required<Pick<User, 'id'>>;

// Create update types
type UpdateUser = {
  id: string;
  updates: Partial<Omit<User, 'id'>>;
};

// Deep readonly for immutable data
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

## 5. Type Guards with User-Defined Type Predicates

Write safer runtime checks:

```typescript
interface Dog {
  type: 'dog';
  breed: string;
  bark(): void;
}

interface Cat {
  type: 'cat';
  meow(): void;
}

type Pet = Dog | Cat;

// Type guard
const isDog = (pet: Pet): pet is Dog => {
  return pet.type === 'dog';
};

const handlePet = (pet: Pet) => {
  if (isDog(pet)) {
    // TypeScript knows pet is Dog here
    pet.bark();
    console.log(`This ${pet.breed} is barking!`);
  } else {
    // TypeScript knows pet is Cat here
    pet.meow();
  }
};
```

## 6. Advanced Generics with Constraints

Build flexible, type-safe functions:

```typescript
interface HasId {
  id: string;
}

interface HasTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

// Generic function with multiple constraints
const updateEntity = <T extends HasId & HasTimestamp>(
  entity: T,
  updates: Partial<Omit<T, 'id' | 'createdAt'>>
): T => {
  return {
    ...entity,
    ...updates,
    updatedAt: new Date(),
  };
};
```

## 7. Declaration Merging for Extending Libraries

Extend third-party library types:

```typescript
// Extend Express Request
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

// Now you can use req.user with full type safety
app.get('/profile', (req, res) => {
  if (req.user) {
    res.json({ userId: req.user.id });
  }
});
```

## Pro Tips

1. **Use `satisfies` operator** for better type inference while maintaining safety
2. **Leverage `const assertions`** for literal types
3. **Create branded types** for better domain modeling
4. **Use discriminated unions** for state management
5. **Implement builder patterns** with method chaining

## Conclusion

These TypeScript patterns will help you write more maintainable, type-safe code. The key is to let TypeScript's type system guide your API design and catch errors at compile time rather than runtime.

---