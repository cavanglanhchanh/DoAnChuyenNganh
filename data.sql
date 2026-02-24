USE BSM_Management;
GO




/* =========================
   1. INSERT CHỦ TRỌ (OWNER)
========================= */
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'owner@gmail.com')
BEGIN
    INSERT INTO users (name, email, password, role, phone)
    VALUES (
        N'Chủ trọ demo',
        'owner@gmail.com',
        '123456',      -- tạm thời, backend sẽ hash
        'OWNER',
        '0900000001'
    );
END
GO

/* =========================
   2. INSERT NHÀ TRỌ
========================= */
DECLARE @ownerId INT;

SELECT @ownerId = id
FROM users
WHERE email = 'owner@gmail.com';

IF NOT EXISTS (SELECT 1 FROM houses WHERE owner_id = @ownerId)
BEGIN
    INSERT INTO houses (owner_id, name, address, total_rooms)
    VALUES (
        @ownerId,
        N'Nhà trọ Demo',
        N'Quận 1, TP.HCM',
        10
    );
END
GO

/* =========================
   3. AUTO TẠO PHÒNG
========================= */
DECLARE @houseId INT;
DECLARE @totalRooms INT;
DECLARE @i INT = 1;

SELECT TOP 1
    @houseId = id,
    @totalRooms = total_rooms
FROM houses
ORDER BY id DESC;

WHILE @i <= @totalRooms
BEGIN
    INSERT INTO rooms (
        house_id,
        owner_id,
        room_name,
        room_price,
        electric_price,
        water_price,
        status
    )
    VALUES (
        @houseId,
        @ownerId,
        N'Phòng ' + CAST(@i AS NVARCHAR),
        0,
        0,
        0,
        'EMPTY'
    );

    SET @i = @i + 1;
END;
GO

IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'tenant1@gmail.com')
BEGIN
    INSERT INTO users (name, email, password, role, phone)
    VALUES (N'Nguyễn Văn A', 'tenant1@gmail.com', '123456', 'TENANT', '0901111111');
END

IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'tenant2@gmail.com')
BEGIN
    INSERT INTO users (name, email, password, role, phone)
    VALUES (N'Trần Thị B', 'tenant2@gmail.com', '123456', 'TENANT', '0902222222');
END

IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'tenant3@gmail.com')
BEGIN
    INSERT INTO users (name, email, password, role, phone)
    VALUES (N'Lê Văn C', 'tenant3@gmail.com', '123456', 'TENANT', '0903333333');
END

IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'tenant4@gmail.com')
BEGIN
    INSERT INTO users (name, email, password, role, phone)
    VALUES (N'Phạm Thị D', 'tenant4@gmail.com', '123456', 'TENANT', '0904444444');
END
GO